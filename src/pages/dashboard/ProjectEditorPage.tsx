import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  fetchProjectById,
  createProject,
  updateProject,
  fetchCategories,
  addProjectImage,
  deleteProjectImage,
} from '../../services/projectService';
import { Project, Category, ProjectImage } from '../../types/database';
import { uploadMediaFile } from '../../lib/supabase';
import { FashionImage } from '../../components/common/FashionImage';
import {
  Save,
  ArrowLeft,
  Upload,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Plus,
  Image as ImageIcon,
} from 'lucide-react';

export const ProjectEditorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isNew = id === 'new' || !id;
  const { user } = useAuth();
  const navigate = useNavigate();

  const [project, setProject] = useState<Project | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Form Fields
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [toolsInput, setToolsInput] = useState('');
  const [coverImagePath, setCoverImagePath] = useState<string | null>(null);
  const [projectDate, setProjectDate] = useState(new Date().toISOString().split('T')[0]);
  const [inspiration, setInspiration] = useState('');
  const [creativeProcess, setCreativeProcess] = useState('');
  const [outcome, setOutcome] = useState('');
  const [images, setImages] = useState<ProjectImage[]>([]);

  useEffect(() => {
    fetchCategories().then((cats) => {
      setCategories(cats);
      if (cats.length > 0 && !categoryId) {
        setCategoryId(cats[0].id);
      }
    });
  }, []);

  useEffect(() => {
    if (isNew) {
      setTitle('');
      setSlug(`proj-${Date.now().toString().slice(-6)}`);
      setLoading(false);
      return;
    }

    if (id) {
      setLoading(true);
      fetchProjectById(id).then(({ data }) => {
        if (data) {
          setProject(data);
          setTitle(data.title);
          setSlug(data.slug);
          setShortDescription(data.short_description || '');
          setDescription(data.description || '');
          setCategoryId(data.category_id || '');
          setTagsInput((data.tags || []).join(', '));
          setToolsInput((data.tools || []).join(', '));
          setCoverImagePath(data.cover_image_path);
          setProjectDate(data.project_date || '');
          setInspiration(data.inspiration || '');
          setCreativeProcess(data.creative_process || '');
          setOutcome(data.outcome || '');
          setImages(data.images || []);
        }
        setLoading(false);
      });
    }
  }, [id, isNew]);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (isNew) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9-]/g, '-'));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id || !title.trim()) return;

    setSaving(true);
    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
    const tools = toolsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
      owner_id: user.id,
      title,
      slug: slug || `project-${Date.now()}`,
      short_description: shortDescription || null,
      description: description || null,
      category_id: categoryId || null,
      tags,
      tools,
      cover_image_path: coverImagePath,
      project_date: projectDate || null,
      inspiration: inspiration || null,
      creative_process: creativeProcess || null,
      outcome: outcome || null,
    };

    if (isNew) {
      const { data, error } = await createProject(payload);
      setSaving(false);
      if (data) {
        navigate(`/dashboard/projects/${data.id}/edit`, { replace: true });
      } else if (error) {
        alert(error.message);
      }
    } else if (project?.id) {
      const { data, error } = await updateProject(project.id, payload);
      setSaving(false);
      if (data) {
        setProject(data);
      } else if (error) {
        alert(error.message);
      }
    }
  };

  const handleUploadCover = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user?.id) return;

    setUploadingImage(true);
    const { path, error } = await uploadMediaFile(file, user.id, project?.id || 'projects');
    setUploadingImage(false);

    if (error) {
      alert(error.message);
    } else {
      setCoverImagePath(path);
    }
  };

  const handleAddGalleryImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user?.id || !project?.id) return;

    setUploadingImage(true);
    const { path, error } = await uploadMediaFile(file, user.id, project.id);
    if (error) {
      alert(error.message);
      setUploadingImage(false);
      return;
    }

    const { data: newImg } = await addProjectImage({
      project_id: project.id,
      owner_id: user.id,
      storage_path: path,
      alt_text: file.name,
      display_order: images.length,
    });
    setUploadingImage(false);

    if (newImg) {
      setImages([...images, newImg]);
    }
  };

  const handleDeleteImage = async (img: ProjectImage) => {
    await deleteProjectImage(img.id, img.storage_path);
    setImages(images.filter((i) => i.id !== img.id));
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <p className="font-serif italic text-sm text-[#78716A]">Opening Design Project...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 pb-6 border-b border-[#E7E2D6]">
        <div className="flex items-center gap-3">
          <Link
            to="/dashboard/projects"
            className="p-1.5 hover:bg-white rounded-lg text-[#57524A]"
            title="Back to Projects"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <span className="text-xs font-mono tracking-widest uppercase text-[#78716A]">
              Project Specification
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#141210]">
              {isNew ? 'Create New Design Project' : title || 'Edit Design Project'}
            </h1>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-5 py-2.5 bg-[#141210] text-white hover:bg-[#2A2723] rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving...' : 'Save Project'}</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Core Attributes */}
        <div className="bg-white border border-[#E7E2D6] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
          <h2 className="font-serif text-xl font-bold text-[#141210]">1. Garment &amp; Collection Details</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-[#141210] mb-1">Project Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. Sculptural Wool Trench · Look 03"
                className="w-full text-xs p-3 rounded-lg border border-[#DCD7CD] bg-[#FAF9F6] text-[#141210]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#141210] mb-1">Fashion Category</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full text-xs p-3 rounded-lg border border-[#DCD7CD] bg-[#FAF9F6] text-[#141210]"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#141210] mb-1">Short Description</label>
            <input
              type="text"
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              placeholder="Architectural double-faced cashmere coat with hand-bound buttonholes and raglan sleeve construction."
              className="w-full text-xs p-3 rounded-lg border border-[#DCD7CD] bg-[#FAF9F6] text-[#141210]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#141210] mb-1">Detailed Technical Description</label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide pattern drafting coordinates, seam allowances, internal horsehair canvas interfacing, and draping techniques..."
              className="w-full text-xs p-3 rounded-lg border border-[#DCD7CD] bg-[#FAF9F6] text-[#141210]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-[#141210] mb-1">Tags (Comma-separated)</label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="Outerwear, Double Weave, Haute Couture, Tailoring"
                className="w-full text-xs p-3 rounded-lg border border-[#DCD7CD] bg-[#FAF9F6] text-[#141210]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#141210] mb-1">Tools &amp; Techniques</label>
              <input
                type="text"
                value={toolsInput}
                onChange={(e) => setToolsInput(e.target.value)}
                placeholder="Draping, CLO 3D, Hand Stitching, Pad Stitching"
                className="w-full text-xs p-3 rounded-lg border border-[#DCD7CD] bg-[#FAF9F6] text-[#141210]"
              />
            </div>
          </div>
        </div>

        {/* Media Uploads: Cover Image and Additional Gallery Views */}
        <div className="bg-white border border-[#E7E2D6] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
          <h2 className="font-serif text-xl font-bold text-[#141210]">2. Imagery &amp; Technical Flats</h2>

          <div>
            <label className="block text-xs font-semibold text-[#141210] mb-2">Primary Cover Plate</label>
            <div className="flex items-center gap-4">
              <label className="cursor-pointer px-4 py-2 border border-[#DCD7CD] hover:border-[#141210] rounded-lg text-xs font-semibold flex items-center gap-2 bg-[#FAF9F6] text-[#141210]">
                <Upload className="w-3.5 h-3.5" />
                <span>{uploadingImage ? 'Uploading...' : 'Upload Cover Photography'}</span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleUploadCover}
                  className="hidden"
                  disabled={uploadingImage}
                />
              </label>
              {coverImagePath && (
                <span className="text-xs font-mono text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Cover Saved to Supabase</span>
                </span>
              )}
            </div>
          </div>

          {!isNew && (
            <div className="pt-4 border-t border-[#F0ECE1] space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-xs text-[#141210]">Supplementary Gallery Plates</h3>
                  <p className="text-[11px] text-[#78716A]">Technical flats, pattern pieces, textile swatches, and runway details.</p>
                </div>
                <label className="cursor-pointer px-3 py-1.5 border border-[#DCD7CD] hover:border-[#141210] rounded-lg text-xs font-semibold flex items-center gap-1.5 bg-[#FAF9F6] text-[#141210]">
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Plate</span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleAddGalleryImage}
                    className="hidden"
                    disabled={uploadingImage}
                  />
                </label>
              </div>

              {images.length === 0 ? (
                <p className="text-xs text-[#78716A] italic py-2">No additional plates added yet.</p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {images.map((img) => (
                    <div key={img.id} className="relative rounded-lg overflow-hidden border border-[#E7E2D6] group">
                      <FashionImage
                        src={img.storage_path}
                        alt={img.alt_text || 'Plate'}
                        aspectRatio="1:1"
                      />
                      <button
                        type="button"
                        onClick={() => handleDeleteImage(img)}
                        className="absolute top-1 right-1 p-1 bg-black/70 hover:bg-red-600 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Delete image"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Process & Inspiration */}
        <div className="bg-white border border-[#E7E2D6] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
          <h2 className="font-serif text-xl font-bold text-[#141210]">3. Atelier Research &amp; Methodology</h2>

          <div>
            <label className="block text-xs font-semibold text-[#141210] mb-1">Concept &amp; Inspiration</label>
            <textarea
              rows={3}
              value={inspiration}
              onChange={(e) => setInspiration(e.target.value)}
              placeholder="Historical references, architecture, natural forms, or cultural themes that informed this work..."
              className="w-full text-xs p-3 rounded-lg border border-[#DCD7CD] bg-[#FAF9F6] text-[#141210]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#141210] mb-1">Creative Process</label>
            <textarea
              rows={3}
              value={creativeProcess}
              onChange={(e) => setCreativeProcess(e.target.value)}
              placeholder="Initial croquis sketches to muslin prototype, fit iterations, textile sourcing, and final garment construction..."
              className="w-full text-xs p-3 rounded-lg border border-[#DCD7CD] bg-[#FAF9F6] text-[#141210]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#141210] mb-1">Final Outcome</label>
            <textarea
              rows={3}
              value={outcome}
              onChange={(e) => setOutcome(e.target.value)}
              placeholder="Runway presentation, jury critique feedback, exhibition results, or commercial capsule launch..."
              className="w-full text-xs p-3 rounded-lg border border-[#DCD7CD] bg-[#FAF9F6] text-[#141210]"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-[#141210] text-white hover:bg-[#2A2723] rounded-lg text-xs font-semibold tracking-wide flex items-center gap-2 transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Design Project'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
