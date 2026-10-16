import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Check, ArrowRight, Sparkles, BookOpen, Scissors } from 'lucide-react';

export const OnboardingPage: React.FC = () => {
  const { profile, updateProfile } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [displayName, setDisplayName] = useState(profile?.display_name || '');
  const [professionalTitle, setProfessionalTitle] = useState(profile?.professional_title || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [institution, setInstitution] = useState(profile?.institution || '');
  const [graduationYear, setGraduationYear] = useState(profile?.graduation_year?.toString() || '2026');
  const [location, setLocation] = useState(profile?.location || '');
  const [websiteUrl, setWebsiteUrl] = useState(profile?.website_url || '');

  const [specialties, setSpecialties] = useState<string[]>(
    profile?.specialties || ['Haute Couture', 'Pattern Drafting']
  );
  const [skills, setSkills] = useState<string[]>(
    profile?.skills || ['Draping', 'Tailoring', 'Textile Manipulation', 'CLO 3D']
  );

  const specialtyOptions = [
    'Haute Couture',
    'Ready-to-Wear (RTW)',
    'Avant-Garde & Wearable Art',
    'Sustainable & Zero-Waste Fashion',
    'Knitwear & Textile Design',
    'Tailoring & Outerwear',
    'Costume & Theatrical Design',
    'Footwear & Accessories',
  ];

  const skillOptions = [
    'Draping on Mannequin',
    'Pattern Drafting & Grading',
    'CLO 3D / Digital Garment Prototyping',
    'Bespoke Tailoring',
    'Surface Embellishment & Embroidery',
    'Textile Manipulation & Weaving',
    'Tech Pack Construction',
    'Fashion Illustration / Croquis',
  ];

  const toggleSpecialty = (item: string) => {
    setSpecialties((prev) =>
      prev.includes(item) ? prev.filter((s) => s !== item) : [...prev, item]
    );
  };

  const toggleSkill = (item: string) => {
    setSkills((prev) => (prev.includes(item) ? prev.filter((s) => s !== item) : [...prev, item]));
  };

  const handleFinish = async () => {
    setLoading(true);
    await updateProfile({
      display_name: displayName,
      professional_title: professionalTitle,
      bio,
      institution,
      graduation_year: graduationYear ? parseInt(graduationYear, 10) : null,
      location,
      website_url: websiteUrl,
      specialties,
      skills,
      onboarding_completed: true,
    });
    setLoading(false);
    navigate('/dashboard/portfolios/new');
  };

  return (
    <div className="max-w-2xl mx-auto py-8 space-y-8">
      {/* Progress Header */}
      <div className="space-y-3 pb-6 border-b border-[#E7E2D6]">
        <div className="flex items-center justify-between text-xs font-mono text-[#78716A]">
          <span>Atelier Onboarding</span>
          <span>Step {step} of 3</span>
        </div>
        <div className="w-full bg-[#E7E2D6] h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-[#141210] h-full transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>
      </div>

      {step === 1 && (
        <div className="bg-white border border-[#E7E2D6] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="space-y-1">
            <h2 className="font-serif text-2xl font-bold text-[#141210]">Your Atelier Identity</h2>
            <p className="text-xs text-[#57524A]">
              How you will be credited across your portfolios and collection spreads.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#141210] mb-1">Display Name</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Gabrielle Chanel"
                className="w-full text-xs p-3 rounded-lg border border-[#DCD7CD] bg-[#FAF9F6] text-[#141210]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#141210] mb-1">
                Professional Title / Role
              </label>
              <input
                type="text"
                value={professionalTitle}
                onChange={(e) => setProfessionalTitle(e.target.value)}
                placeholder="Haute Couture Apprentice / Fashion Scholar"
                className="w-full text-xs p-3 rounded-lg border border-[#DCD7CD] bg-[#FAF9F6] text-[#141210]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#141210] mb-1">Designer Statement / Bio</label>
              <textarea
                rows={4}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Describe your creative methodology, relationship to form, textile experimentation, or tailoring ethos..."
                className="w-full text-xs p-3 rounded-lg border border-[#DCD7CD] bg-[#FAF9F6] text-[#141210]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#141210] mb-1">Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Paris, France"
                  className="w-full text-xs p-3 rounded-lg border border-[#DCD7CD] bg-[#FAF9F6] text-[#141210]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#141210] mb-1">Portfolio Website</label>
                <input
                  type="url"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  placeholder="https://atelier.com"
                  className="w-full text-xs p-3 rounded-lg border border-[#DCD7CD] bg-[#FAF9F6] text-[#141210]"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-[#F0ECE1]">
            <button
              onClick={() => setStep(2)}
              className="px-6 py-2.5 bg-[#141210] text-white rounded-lg text-xs font-semibold flex items-center gap-2 hover:bg-[#2A2723]"
            >
              <span>Next: Academic Lineage</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="bg-white border border-[#E7E2D6] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="space-y-1">
            <h2 className="font-serif text-2xl font-bold text-[#141210]">Academic &amp; Studio Lineage</h2>
            <p className="text-xs text-[#57524A]">
              Fashion institution or atelier where you hone your craftsmanship.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#141210] mb-1">Fashion Institution / Academy</label>
              <input
                type="text"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                placeholder="Institut Français de la Mode / Central Saint Martins"
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

          <div className="flex justify-between pt-4 border-t border-[#F0ECE1]">
            <button
              onClick={() => setStep(1)}
              className="px-4 py-2 border border-[#DCD7CD] rounded-lg text-xs font-semibold hover:border-[#141210]"
            >
              Back
            </button>
            <button
              onClick={() => setStep(3)}
              className="px-6 py-2.5 bg-[#141210] text-white rounded-lg text-xs font-semibold flex items-center gap-2 hover:bg-[#2A2723]"
            >
              <span>Next: Design Focus</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="bg-white border border-[#E7E2D6] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="space-y-1">
            <h2 className="font-serif text-2xl font-bold text-[#141210]">Specialties &amp; Craft Competencies</h2>
            <p className="text-xs text-[#57524A]">
              Highlight your fashion design domain and technical atelier abilities.
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-xs font-semibold text-[#141210] mb-2">Design Specializations</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {specialtyOptions.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => toggleSpecialty(opt)}
                    className={`p-2.5 rounded-lg border text-left text-xs transition-colors flex items-center justify-between ${
                      specialties.includes(opt)
                        ? 'bg-[#141210] text-white border-[#141210]'
                        : 'bg-[#FAF9F6] border-[#E7E2D6] text-[#57524A] hover:border-[#141210]'
                    }`}
                  >
                    <span>{opt}</span>
                    {specialties.includes(opt) && <Check className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#141210] mb-2">Technical Skills</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {skillOptions.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => toggleSkill(opt)}
                    className={`p-2.5 rounded-lg border text-left text-xs transition-colors flex items-center justify-between ${
                      skills.includes(opt)
                        ? 'bg-[#141210] text-white border-[#141210]'
                        : 'bg-[#FAF9F6] border-[#E7E2D6] text-[#57524A] hover:border-[#141210]'
                    }`}
                  >
                    <span>{opt}</span>
                    {skills.includes(opt) && <Check className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t border-[#F0ECE1]">
            <button
              onClick={() => setStep(2)}
              className="px-4 py-2 border border-[#DCD7CD] rounded-lg text-xs font-semibold hover:border-[#141210]"
            >
              Back
            </button>
            <button
              onClick={handleFinish}
              disabled={loading}
              className="px-6 py-2.5 bg-[#141210] text-white rounded-lg text-xs font-semibold flex items-center gap-2 hover:bg-[#2A2723] disabled:opacity-50"
            >
              <span>{loading ? 'Finalizing Profile...' : 'Create Your First Portfolio'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
