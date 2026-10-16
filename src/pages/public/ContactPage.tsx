import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { isSupabaseConfigured } from '../../lib/config';
import { Mail, CheckCircle2, AlertCircle, Send } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setError('Please complete all fields before sending.');
      return;
    }

    setLoading(true);

    if (!isSupabaseConfigured) {
      // Simulate real validation error when DB is pending
      setError('Backend database is not connected. Please configure Supabase environment variables.');
      setLoading(false);
      return;
    }

    try {
      const { error: insertError } = await supabase.from('contact_submissions').insert({
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
        status: 'unread',
      });

      if (insertError) throw insertError;

      setSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err: any) {
      setError(err.message || 'Failed to submit message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      <div className="space-y-3 pb-6 border-b border-[#E7E2D6]">
        <span className="text-xs font-mono tracking-widest text-[#78716A] uppercase">Inquiries &amp; Support</span>
        <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#141210]">
          Contact the Atelier
        </h1>
        <p className="text-sm text-[#57524A]">
          Have questions regarding institutional partnerships, portfolio publishing, or technical assistance? Send us a direct inquiry.
        </p>
      </div>

      {success ? (
        <div className="p-8 border border-emerald-200 bg-emerald-50/50 rounded-2xl text-center space-y-4">
          <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
          <h3 className="font-serif text-2xl font-bold text-emerald-950">Inquiry Received</h3>
          <p className="text-xs text-emerald-800 max-w-md mx-auto leading-relaxed">
            Your message has been securely submitted to the atelier team. We will review and respond via your provided email address shortly.
          </p>
          <button
            onClick={() => setSuccess(false)}
            className="px-4 py-2 bg-emerald-900 text-white rounded-lg text-xs font-semibold hover:bg-emerald-850"
          >
            Send Another Message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white border border-[#E7E2D6] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-[#141210] mb-1.5">Full Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Gabrielle Chanel"
                className="w-full text-xs p-3 rounded-lg border border-[#DCD7CD] bg-[#FAF9F6] text-[#141210] focus:outline-hidden focus:border-[#141210]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#141210] mb-1.5">Email Address</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="designer@atelier.com"
                className="w-full text-xs p-3 rounded-lg border border-[#DCD7CD] bg-[#FAF9F6] text-[#141210] focus:outline-hidden focus:border-[#141210]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#141210] mb-1.5">Subject</label>
            <input
              type="text"
              required
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              placeholder="Portfolio Review / Institutional Partnership"
              className="w-full text-xs p-3 rounded-lg border border-[#DCD7CD] bg-[#FAF9F6] text-[#141210] focus:outline-hidden focus:border-[#141210]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#141210] mb-1.5">Message Content</label>
            <textarea
              required
              rows={5}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Describe your inquiry..."
              className="w-full text-xs p-3 rounded-lg border border-[#DCD7CD] bg-[#FAF9F6] text-[#141210] focus:outline-hidden focus:border-[#141210]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-6 py-3 bg-[#141210] text-white hover:bg-[#2A2723] rounded-lg text-xs font-semibold tracking-wide flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
          >
            {loading ? (
              <span>Transmitting...</span>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Submit Inquiry</span>
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
};
