// Supabase Edge Function: admin-action
// Privileged administrative operations with JWT authentication & service role isolation
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing authorization header" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";

    // Client for verifying caller
    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: userError } = await userClient.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized user" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Privileged client for database and Auth admin calls
    const adminClient = createClient(supabaseUrl, supabaseServiceKey);

    // Verify caller has admin role in profiles table
    const { data: profile, error: profileError } = await adminClient
      .from("profiles")
      .select("role, account_status")
      .eq("id", user.id)
      .single();

    if (profileError || profile?.role !== "admin" || profile?.account_status !== "active") {
      return new Response(JSON.stringify({ error: "Forbidden: Caller is not an active administrator" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { action, target_user_id, new_role, new_status, reason, target_portfolio_id, moderation_status } = await req.json();

    let result = null;

    if (action === "update_user_role") {
      if (!["user", "admin"].includes(new_role)) {
        throw new Error("Invalid role specified");
      }
      const { data, error } = await adminClient
        .from("profiles")
        .update({ role: new_role, updated_at: new Date().toISOString() })
        .eq("id", target_user_id)
        .select()
        .single();
      if (error) throw error;
      result = data;

      // Log to audit table
      await adminClient.from("admin_audit_logs").insert({
        actor_id: user.id,
        action: "UPDATE_USER_ROLE",
        target_type: "profile",
        target_id: target_user_id,
        reason: reason || "Admin role change",
        metadata: { new_role },
      });
    } else if (action === "update_user_status") {
      if (!["active", "suspended"].includes(new_status)) {
        throw new Error("Invalid account status");
      }
      const { data, error } = await adminClient
        .from("profiles")
        .update({ account_status: new_status, updated_at: new Date().toISOString() })
        .eq("id", target_user_id)
        .select()
        .single();
      if (error) throw error;
      result = data;

      await adminClient.from("admin_audit_logs").insert({
        actor_id: user.id,
        action: "UPDATE_USER_STATUS",
        target_type: "profile",
        target_id: target_user_id,
        reason: reason || "Account status update",
        metadata: { new_status },
      });
    } else if (action === "moderate_portfolio") {
      const { data, error } = await adminClient
        .from("portfolios")
        .update({ moderation_status, updated_at: new Date().toISOString() })
        .eq("id", target_portfolio_id)
        .select()
        .single();
      if (error) throw error;
      result = data;

      await adminClient.from("admin_audit_logs").insert({
        actor_id: user.id,
        action: "MODERATE_PORTFOLIO",
        target_type: "portfolio",
        target_id: target_portfolio_id,
        reason: reason || "Portfolio moderation",
        metadata: { moderation_status },
      });
    } else if (action === "delete_user_account") {
      // 1. Delete user files in portfolio-media under {target_user_id}/
      const { data: fileList } = await adminClient.storage
        .from("portfolio-media")
        .list(target_user_id);
      if (fileList && fileList.length > 0) {
        const filePaths = fileList.map((f) => `${target_user_id}/${f.name}`);
        await adminClient.storage.from("portfolio-media").remove(filePaths);
      }

      // 2. Delete Auth user via Supabase Auth Admin API (cascades to profiles, portfolios, projects)
      const { error: deleteAuthError } = await adminClient.auth.admin.deleteUser(target_user_id);
      if (deleteAuthError) throw deleteAuthError;

      await adminClient.from("admin_audit_logs").insert({
        actor_id: user.id,
        action: "DELETE_USER_ACCOUNT",
        target_type: "user",
        target_id: target_user_id,
        reason: reason || "Account deletion",
        metadata: { deleted_at: new Date().toISOString() },
      });
      result = { deleted: true };
    } else {
      return new Response(JSON.stringify({ error: `Unknown action: ${action}` }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true, data: result }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
