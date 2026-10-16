import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Save, CheckCircle2, AlertCircle, User, Sparkles } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { profile, updateProfile } = useAuth();

  const [displayName, setDisplayName] = useState(profile?.display_name || '');
  const [username, setUsername] = useState(profile?.username || '');
  const [professionalTitle, setProfessionalTitle] = useState(profile?.professional_title || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [institution, setInstitution] = useState(profile?.institution || '');
  const [graduationYear, setGraduationYear] = useState(profile?.graduation_year?.toString() || '');
  const [location, setLocation] = useState(profile?.location || '');
  const [websiteUrl, setWebsiteUrl] = useState(profile?.website_url || '');
  const [specialtiesInput, setSpecialtiesInput] = useState((profile?.specialties || []).join(', '));
  const [skillsInput, setSkillsInput] = useState((profile?.skills || []).join(', '));
  const [emailLink, setEmailLink] = useState(profile?.social_links?.email || '');
  const [instagram, setInstagram] = useState(profile?.social_links?.instagram || '');
  const [linkedin, setLinkedin] = useState(profile?.social_links?.linkedin || '');

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    const specialties = specialtiesInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const skills = skillsInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const { error: updateError } = await updateProfile({
      display_name: displayName,
      username: username ? username.toLowerCase().replace(/[^a-z0-9_]/g, '') : null,
      professional_title: professionalTitle || null,
      bio: bio || null,
      institution: institution || null,
      graduation_year: graduationYear ? parseInt(graduationYear, 10) : null,
      location: location || null,
      website_url: websiteUrl || null,
      specialties,
      skills,
      social_links: {
        email: emailLink,
        instagram,
        linkedin,
      },
    });

    setSaving(false);

    if (updateError) {
      setError(updateError.message);
    } else {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 pb-6 border-b border-[#E7E2D6]">
        <div>
          <span className="text-xs font-mono tracking-widest uppercase text-[#78716A]">
            Atelier Profile &amp; Lineage
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#141210]">
            Designer Profile Settings
          </h1>
          <p className="text-xs text-[#57524A] mt-1">
            Keep your professional coordinates, educational credentials, and specialties updated.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-5 py-2.5 bg-[#141210] text-white hover:bg-[#2A2723] rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving...' : 'Save Profile'}</span>
        </button>
      </div>

      {success && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Profile changes successfully persisted to PostgreSQL database.</span>
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        <div className="bg-white border border-[#E7E2D6] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
          <h2 className="font-serif text-xl font-bold text-[#141210]">General Designer Identity</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-[#141210] mb-1">Display Name</label>
              <input
                type="text"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full text-xs p-3 rounded-lg border border-[#DCD7CD] bg-[#FAF9F6] text-[#141210]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#141210] mb-1">Username / Handle</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="gabrielle_chanel"
                className="w-full text-xs p-3 rounded-lg border border-[#DCD7CD] bg-[#FAF9F6] text-[#141210]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#141210] mb-1">Professional Title</label>
            <input
              type="text"
              value={professionalTitle}
              onChange={(e) => setProfessionalTitle(e.target.value)}
              placeholder="Haute Couture Apprentice / Fashion Scholar"
              className="w-full text-xs p-3 rounded-lg border border-[#DCD7CD] bg-[#FAF9F6] text-[#141210]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#141210] mb-1">Designer Biography / Statement</label>
            <textarea
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full text-xs p-3 rounded-lg border border-[#DCD7CD] bg-[#FAF9F6] text-[#141210]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-[#141210] mb-1">Fashion Institution / Academy</label>
              <input
                type="text"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                className="w-full text-xs p-3 rounded-lg border border-[#DCD7CD] bg-[#FAF9F6] text-[#141210]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#141210] mb-1">Graduation Year</label>
              <input
                type="number"
                value={graduationYear}
                onChange={(e) => setGraduationYear(e.target.value)}
                placeholder="2026"
                className="w-full text-xs p-3 rounded-lg border border-[#DCD7CD] bg-[#FAF9F6] text-[#141210]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-[#141210] mb-1">Location / Atelier City</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full text-xs p-3 rounded-lg border border-[#DCD7CD] bg-[#FAF9F6] text-[#141210]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#141210] mb-1">Atelier Website URL</label>
              <input
                type="url"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                placeholder="https://chanel.com"
                className="w-full text-xs p-3 rounded-lg border border-[#DCD7CD] bg-[#FAF9F6] text-[#141210]"
              />
            </div>
          </div>
        </div>

        {/* Specialties & Skills */}
        <div className="bg-white border border-[#E7E2D6] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
          <h2 className="font-serif text-xl font-bold text-[#141210]">Specialties &amp; Craftsmanship</h2>

          <div>
            <label className="block text-xs font-semibold text-[#141210] mb-1">
              Design Specialties (Comma-separated)
            </label>
            <input
              type="text"
              value={specialtiesInput}
              onChange={(e) => setSpecialtiesInput(e.target.value)}
              placeholder="Haute Couture, Sustainable Fashion, Knitwear, Pattern Grading"
              className="w-full text-xs p-3 rounded-lg border border-[#DCD7CD] bg-[#FAF9F6] text-[#141210]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#141210] mb-1">
              Technical Atelier Skills (Comma-separated)
            </label>
            <input
              type="text"
              value={skillsInput}
              onChange={(e) => setSkillsInput(e.target.value)}
              placeholder="Draping, CLO 3D, Hand Embroidery, Pad Stitching, Millinery"
              className="w-full text-xs p-3 rounded-lg border border-[#DCD7CD] bg-[#FAF9F6] text-[#141210]"
            />
          </div>
        </div>

        {/* Contact Links */}
        <div className="bg-white border border-[#E7E2D6] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
          <h2 className="font-serif text-xl font-bold text-[#141210]">Public Contact &amp; Channels</h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#141210] mb-1">Inquiry Email</label>
              <input
                type="email"
                value={emailLink}
                onChange={(e) => setEmailLink(e.target.value)}
                placeholder="contact@atelier.com"
                className="w-full text-xs p-3 rounded-lg border border-[#DCD7CD] bg-[#FAF9F6] text-[#141210]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#141210] mb-1">Instagram Handle</label>
              <input
                type="text"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                placeholder="@atelier"
                className="w-full text-xs p-3 rounded-lg border border-[#DCD7CD] bg-[#FAF9F6] text-[#141210]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#141210] mb-1">LinkedIn Profile</label>
              <input
                type="text"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                placeholder="linkedin.com/in/..."
                className="w-full text-xs p-3 rounded-lg border border-[#DCD7CD] bg-[#FAF9F6] text-[#141210]"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-[#141210] text-white hover:bg-[#2A2723] rounded-lg text-xs font-semibold tracking-wide flex items-center gap-2 transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Profile Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
