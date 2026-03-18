import {
  AcademicCapIcon,
  BuildingOffice2Icon,
  ChevronDownIcon,
  ChevronUpIcon,
  DevicePhoneMobileIcon,
  EnvelopeIcon,
  FlagIcon,
  MapIcon,
  MapPinIcon,
  PencilIcon,
  PlusIcon,
  SparklesIcon,
  TrashIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import {Editor} from '@tinymce/tinymce-react';
import classNames from 'classnames';
import Link from 'next/link';
import {FC, memo, useCallback, useEffect, useRef, useState} from 'react';

import FacebookIcon from '../../components/Icon/FacebookIcon';
import GithubIcon from '../../components/Icon/GithubIcon';
import InstagramIcon from '../../components/Icon/InstagramIcon';
import LinkedInIcon from '../../components/Icon/LinkedInIcon';
import QuoteIcon from '../../components/Icon/QuoteIcon';
import TwitterIcon from '../../components/Icon/TwitterIcon';

// ─── Types ───────────────────────────────────────────────
interface AboutItem { label: string; text: string; icon: string }
interface AboutData { profileImage: string; description: string; aboutItems: AboutItem[] }
interface SkillEntry { name: string; level: number }
interface SkillGroup { name: string; skills: SkillEntry[] }
interface PortfolioItem { title: string; description: string; url: string; blur: boolean; background: string; image: string }
interface TestimonialItem { name: string; text: string; image: string }
interface ContactItem { type: string; text: string; href: string }
interface ContactData { headerText: string; description: string; items: ContactItem[] }
interface SocialLink { label: string; icon: string; href: string }
interface TimelineEntry { date: string; location: string; title: string; content: string }
interface HeroData { name: string; nameColor: string; descriptionHtml: string; buttonText: string; buttonLink: string }
interface MetaData { title: string; description: string }
interface PortfolioData {
  meta: MetaData; hero: HeroData; about: AboutData; skills: SkillGroup[];
  freelancePortfolio: PortfolioItem[]; portfolio: PortfolioItem[];
  testimonials: TestimonialItem[]; contact: ContactData; socialLinks: SocialLink[];
  education: TimelineEntry[]; training: TimelineEntry[]; experience: TimelineEntry[];
}

// ─── Icon Maps ───────────────────────────────────────────
const ABOUT_ICON_MAP: Record<string, FC<{className?: string}>> = {
  MapIcon, FlagIcon, SparklesIcon, AcademicCapIcon, BuildingOffice2Icon,
};
const ABOUT_ICON_OPTIONS = Object.keys(ABOUT_ICON_MAP);

const CONTACT_ICON_MAP: Record<string, FC<{className?: string}>> = {
  Email: EnvelopeIcon, Phone: DevicePhoneMobileIcon, Location: MapPinIcon,
  Github: GithubIcon, LinkedIn: LinkedInIcon, Facebook: FacebookIcon,
  Twitter: TwitterIcon, Instagram: InstagramIcon,
};
const CONTACT_TYPES = Object.keys(CONTACT_ICON_MAP);

const SOCIAL_ICON_MAP: Record<string, FC<{className?: string}>> = {
  LinkedInIcon, GithubIcon, InstagramIcon, TwitterIcon, FacebookIcon,
};
const SOCIAL_ICON_OPTIONS = Object.keys(SOCIAL_ICON_MAP);

// ─── Helpers ─────────────────────────────────────────────
function getToken(): string | null {
  return typeof window !== 'undefined' ? sessionStorage.getItem('adminToken') : null;
}
function swap<T>(arr: T[], i: number, j: number): T[] {
  const copy = [...arr];
  [copy[i], copy[j]] = [copy[j], copy[i]];
  return copy;
}
async function authFetch(url: string, opts: RequestInit = {}) {
  return fetch(url, {...opts, headers: {'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}`, ...opts.headers}});
}

// ─── Reusable Edit UI ────────────────────────────────────
const Overlay: FC<{onEdit: () => void; onDelete: () => void}> = ({onEdit, onDelete}) => (
  <div className="absolute right-2 top-2 z-20 flex gap-1">
    <button className="rounded-full bg-orange-600 p-1.5 text-white shadow-lg transition hover:bg-orange-700" onClick={onEdit} title="Edit" type="button">
      <PencilIcon className="h-4 w-4" />
    </button>
    <button className="rounded-full bg-red-600 p-1.5 text-white shadow-lg transition hover:bg-red-700" onClick={onDelete} title="Delete" type="button">
      <TrashIcon className="h-4 w-4" />
    </button>
  </div>
);

// Overlay with reorder arrows
const OrderOverlay: FC<{onEdit: () => void; onDelete: () => void; onMoveUp?: () => void; onMoveDown?: () => void}> = ({onEdit, onDelete, onMoveUp, onMoveDown}) => (
  <div className="absolute right-2 top-2 z-20 flex gap-1">
    {onMoveUp && (
      <button className="rounded-full bg-gray-600 p-1.5 text-white shadow-lg transition hover:bg-gray-500" onClick={onMoveUp} title="Move Up" type="button">
        <ChevronUpIcon className="h-4 w-4" />
      </button>
    )}
    {onMoveDown && (
      <button className="rounded-full bg-gray-600 p-1.5 text-white shadow-lg transition hover:bg-gray-500" onClick={onMoveDown} title="Move Down" type="button">
        <ChevronDownIcon className="h-4 w-4" />
      </button>
    )}
    <button className="rounded-full bg-orange-600 p-1.5 text-white shadow-lg transition hover:bg-orange-700" onClick={onEdit} title="Edit" type="button">
      <PencilIcon className="h-4 w-4" />
    </button>
    <button className="rounded-full bg-red-600 p-1.5 text-white shadow-lg transition hover:bg-red-700" onClick={onDelete} title="Delete" type="button">
      <TrashIcon className="h-4 w-4" />
    </button>
  </div>
);

const AddCard: FC<{label: string; onClick: () => void; className?: string}> = ({label, onClick, className}) => (
  <button
    className={classNames('flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-500 p-8 text-gray-400 transition hover:border-orange-500 hover:text-orange-400', className)}
    onClick={onClick} type="button">
    <PlusIcon className="h-8 w-8" />
    <span className="text-sm font-medium">{label}</span>
  </button>
);

// Modal wrapper
const Modal: FC<{title: string; onClose: () => void; children: React.ReactNode}> = ({title, onClose, children}) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
    <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-gray-800 p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-bold text-white">{title}</h3>
        <button className="text-gray-400 hover:text-white" onClick={onClose} type="button"><XMarkIcon className="h-5 w-5" /></button>
      </div>
      {children}
    </div>
  </div>
);

// Form field helpers
const FLabel: FC<{label: string; children: React.ReactNode}> = ({label, children}) => (
  <div className="mb-3">
    <label className="mb-1 block text-xs font-medium text-gray-400">{label}</label>
    {children}
  </div>
);
const FInput: FC<{value: string; onChange: (v: string) => void; placeholder?: string}> = ({value, onChange, placeholder}) => (
  <input className="w-full rounded-lg border border-gray-600 bg-gray-700 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-orange-500 focus:outline-none" onChange={e => onChange(e.target.value)} placeholder={placeholder} value={value} />
);
const FTextArea: FC<{value: string; onChange: (v: string) => void; rows?: number; placeholder?: string}> = ({value, onChange, rows = 3, placeholder}) => (
  <textarea className="w-full rounded-lg border border-gray-600 bg-gray-700 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-orange-500 focus:outline-none" onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows} value={value} />
);
const FSelect: FC<{value: string; onChange: (v: string) => void; options: string[]}> = ({value, onChange, options}) => (
  <select className="w-full rounded-lg border border-gray-600 bg-gray-700 px-3 py-2 text-sm text-white focus:border-orange-500 focus:outline-none" onChange={e => onChange(e.target.value)} value={value}>
    {options.map(o => <option key={o} value={o}>{o}</option>)}
  </select>
);
const SaveBtn: FC<{onClick: () => void; label?: string}> = ({onClick, label = 'Save'}) => (
  <button className="mt-4 w-full rounded-lg bg-orange-600 py-2 text-sm font-semibold text-white transition hover:bg-orange-700" onClick={onClick} type="button">{label}</button>
);

// Rich text editor using TinyMCE
const RichTextEditor: FC<{value: string; onChange: (v: string) => void}> = ({value, onChange}) => {
  const editorRef = useRef<unknown>(null);
  return (
    <Editor
      init={{
        height: 250,
        menubar: false,
        plugins: 'lists link forecolor',
        toolbar: 'bold italic underline | forecolor | bullist numlist | link | removeformat',
        skin_url: '/tinymce/skins/ui/oxide-dark',
        content_css: '/tinymce/skins/content/dark/content.min.css',
        branding: false,
        statusbar: false,
        promotion: false,
        content_style: 'body { font-family: system-ui, sans-serif; font-size: 14px; color: #e5e7eb; }',
      }}
      onEditorChange={(content: string) => onChange(content)}
      onInit={(_evt: unknown, editor: unknown) => { editorRef.current = editor; }}
      tinymceScriptSrc="/tinymce/tinymce.min.js"
      value={value}
    />
  );
};

// Image field with upload support
const ImageField: FC<{value: string; onChange: (url: string) => void; label?: string}> = ({value, onChange, label = 'Image'}) => {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result as string;
        const res = await authFetch('/api/upload', {
          method: 'POST',
          body: JSON.stringify({fileName: file.name, fileData: base64}),
        });
        if (res.ok) {
          const data = await res.json();
          onChange(data.url);
        }
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch {
      setUploading(false);
    }
  }, [onChange]);

  return (
    <FLabel label={label}>
      <div className="flex gap-2">
        <FInput onChange={onChange} placeholder="/uploads/image.png or https://..." value={value} />
      </div>
      <div className="mt-2 flex items-center gap-3">
        <label className="cursor-pointer rounded-lg border border-gray-600 bg-gray-700 px-3 py-1.5 text-xs text-gray-300 transition hover:border-orange-500 hover:text-orange-400">
          {uploading ? 'Uploading...' : '📁 Upload File'}
          <input accept="image/*" className="hidden" disabled={uploading} onChange={handleFileChange} type="file" />
        </label>
        {value && (
          <img alt="preview" className="h-10 w-10 rounded border border-gray-600 object-cover" src={value} />
        )}
      </div>
    </FLabel>
  );
};

// ═══════════════════════════════════════════════════════════
// MAIN DASHBOARD
// ═══════════════════════════════════════════════════════════
const AdminDashboard: FC = memo(() => {
  const [data, setData] = useState<PortfolioData | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    const token = getToken();
    if (!token) { window.location.href = '/admin/login'; return; }
    authFetch('/api/auth')
      .then(r => { if (!r.ok) throw new Error(); return authFetch('/api/portfolio-data'); })
      .then(r => r.json())
      .then(d => setData(d))
      .catch(() => { sessionStorage.removeItem('adminToken'); window.location.href = '/admin/login'; });
  }, []);

  const save = useCallback(async (section: keyof PortfolioData, value: unknown) => {
    setSaving(true);
    const updated = {...data!, [section]: value};
    setData(updated as PortfolioData);
    try {
      const res = await authFetch('/api/portfolio-data', {method: 'PUT', body: JSON.stringify({section, data: value})});
      setToast(res.ok ? '✓ Saved!' : '✕ Save failed');
    } catch { setToast('✕ Network error'); }
    finally { setSaving(false); setTimeout(() => setToast(null), 2500); }
  }, [data]);

  const handleLogout = useCallback(async () => {
    await authFetch('/api/auth', {method: 'DELETE'});
    sessionStorage.removeItem('adminToken');
    window.location.href = '/admin/login';
  }, []);

  if (!data) return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900">
      <div className="text-gray-400">Loading dashboard...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-neutral-900">
      {/* Admin top bar */}
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-gray-700 bg-neutral-900/95 px-6 py-3 backdrop-blur">
        <div className="flex items-center gap-3">
          <span className="text-lg font-bold text-white">🎨 Portfolio Admin</span>
          {saving && <span className="text-xs text-orange-400">Saving...</span>}
          {toast && <span className={`text-xs ${toast.startsWith('✓') ? 'text-green-400' : 'text-red-400'}`}>{toast}</span>}
        </div>
        <div className="flex items-center gap-4">
          <Link className="text-sm text-gray-400 transition hover:text-white" href="/admin/settings">⚙️ Settings</Link>
          <a className="text-sm text-gray-400 transition hover:text-white" href="/" rel="noopener noreferrer" target="_blank">👁 View Site</a>
          <button className="text-sm text-red-400 transition hover:text-red-300" onClick={handleLogout} type="button">Logout</button>
        </div>
      </div>

      {/* Sections rendered like the public site */}
      <AdminHero data={data.hero} onSave={v => save('hero', v)} socialLinks={data.socialLinks} onSaveSocials={v => save('socialLinks', v)} />
      <AdminAbout data={data.about} onSave={v => save('about', v)} />
      <AdminResume education={data.education} experience={data.experience} onSave={save} skills={data.skills} training={data.training} />
      <AdminPortfolio freelance={data.freelancePortfolio} onSave={save} portfolio={data.portfolio} />
      <AdminTestimonials data={data.testimonials} onSave={v => save('testimonials', v)} />
      <AdminContact data={data.contact} onSave={v => save('contact', v)} />
      <AdminFooter data={data.socialLinks} onSave={v => save('socialLinks', v)} />
    </div>
  );
});

// ─── HERO ────────────────────────────────────────────────
const AdminHero: FC<{data: HeroData; socialLinks: SocialLink[]; onSave: (d: HeroData) => void; onSaveSocials: (d: SocialLink[]) => void}> = memo(({data, socialLinks, onSave, onSaveSocials}) => {
  const [editing, setEditing] = useState(false);
  const [editingSocials, setEditingSocials] = useState(false);
  const [draft, setDraft] = useState(data);
  useEffect(() => { setDraft(data); }, [data]);

  return (
    <section className="relative flex min-h-[60vh] w-full items-center justify-center bg-gray-800">
      <Overlay onDelete={() => {}} onEdit={() => setEditing(true)} />
      <div className="z-10 max-w-screen-lg px-4">
        <div className="flex flex-col items-center gap-y-6 rounded-xl bg-gray-800/40 p-6 text-center shadow-lg backdrop-blur-sm">
          <h1 className="text-4xl font-bold sm:text-5xl lg:text-7xl" style={{color: data.nameColor || '#ffffff'}}>{data.name}</h1>
          <div dangerouslySetInnerHTML={{__html: data.descriptionHtml}} />
          {/* Social links */}
          <div className="flex gap-x-4 text-neutral-100">
            {socialLinks.map((link, i) => {
              const IconComp = SOCIAL_ICON_MAP[link.icon];
              return IconComp ? <span className="p-1.5" key={i}><IconComp className="h-5 w-5" /></span> : null;
            })}
            <button className="rounded border border-dashed border-gray-500 px-2 py-1 text-xs text-gray-400 hover:border-orange-500 hover:text-orange-400" onClick={() => setEditingSocials(true)} type="button">
              Edit Socials
            </button>
          </div>
          {/* Contact button */}
          <div className="flex w-full justify-center gap-x-4">
            <span className="flex gap-x-2 rounded-full border-2 border-white px-4 py-2 text-sm font-medium text-white">
              {data.buttonText || 'Contact'}
            </span>
          </div>
        </div>
      </div>
      {editing && (
        <Modal onClose={() => setEditing(false)} title="Edit Hero">
          <FLabel label="Name / Headline"><FInput onChange={v => setDraft({...draft, name: v})} value={draft.name} /></FLabel>
          <FLabel label="Name Text Color">
            <div className="flex items-center gap-3">
              <input className="h-10 w-16 cursor-pointer rounded border border-gray-600 bg-gray-700" onChange={e => setDraft({...draft, nameColor: e.target.value})} type="color" value={draft.nameColor || '#ffffff'} />
              <FInput onChange={v => setDraft({...draft, nameColor: v})} placeholder="#ffffff" value={draft.nameColor || ''} />
            </div>
          </FLabel>
          <FLabel label="Description"><RichTextEditor onChange={v => setDraft({...draft, descriptionHtml: v})} value={draft.descriptionHtml} /></FLabel>
          <FLabel label="Button Text"><FInput onChange={v => setDraft({...draft, buttonText: v})} placeholder="Contact" value={draft.buttonText || ''} /></FLabel>
          <FLabel label="Button Link"><FInput onChange={v => setDraft({...draft, buttonLink: v})} placeholder="#contact" value={draft.buttonLink || ''} /></FLabel>
          <SaveBtn onClick={() => { onSave(draft); setEditing(false); }} />
        </Modal>
      )}
      {editingSocials && (
        <SocialLinksModal items={socialLinks} onClose={() => setEditingSocials(false)} onSave={v => { onSaveSocials(v); setEditingSocials(false); }} />
      )}
    </section>
  );
});

// Shared social links editor modal (used by hero and footer)
const SocialLinksModal: FC<{items: SocialLink[]; onSave: (d: SocialLink[]) => void; onClose: () => void}> = ({items: initial, onSave, onClose}) => {
  const [items, setItems] = useState(initial);
  const update = (i: number, field: keyof SocialLink, val: string) => { const next = [...items]; next[i] = {...next[i], [field]: val}; setItems(next); };
  const add = () => setItems([...items, {label: '', icon: 'GithubIcon', href: ''}]);
  const remove = (i: number) => setItems(items.filter((_, idx) => idx !== i));
  const move = (i: number, dir: -1 | 1) => { if (i + dir >= 0 && i + dir < items.length) setItems(swap(items, i, i + dir)); };

  return (
    <Modal onClose={onClose} title="Edit Social Links">
      <div className="space-y-3">
        {items.map((link, i) => {
          const IconComp = SOCIAL_ICON_MAP[link.icon];
          return (
            <div className="flex items-center gap-2 rounded-lg border border-gray-600 bg-gray-700/50 p-3" key={i}>
              <div className="flex flex-col gap-0.5">
                {i > 0 && <button className="text-gray-400 hover:text-white" onClick={() => move(i, -1)} type="button"><ChevronUpIcon className="h-3.5 w-3.5" /></button>}
                {i < items.length - 1 && <button className="text-gray-400 hover:text-white" onClick={() => move(i, 1)} type="button"><ChevronDownIcon className="h-3.5 w-3.5" /></button>}
              </div>
              <span className="text-gray-400">{IconComp ? <IconComp className="h-5 w-5" /> : null}</span>
              <div className="flex-1 space-y-1">
                <div className="flex gap-2">
                  <FInput onChange={v => update(i, 'label', v)} placeholder="Platform" value={link.label} />
                  <FSelect onChange={v => update(i, 'icon', v)} options={SOCIAL_ICON_OPTIONS} value={link.icon} />
                </div>
                <FInput onChange={v => update(i, 'href', v)} placeholder="https://..." value={link.href} />
              </div>
              <button className="text-red-400 hover:text-red-300" onClick={() => remove(i)} type="button"><XMarkIcon className="h-4 w-4" /></button>
            </div>
          );
        })}
        <button className="w-full rounded-lg border border-dashed border-gray-500 py-2 text-xs text-gray-400 hover:border-orange-500 hover:text-orange-400" onClick={add} type="button">+ Add Social Link</button>
      </div>
      <SaveBtn onClick={() => onSave(items)} />
    </Modal>
  );
};

// ─── ABOUT ───────────────────────────────────────────────
const AdminAbout: FC<{data: AboutData; onSave: (d: AboutData) => void}> = memo(({data, onSave}) => {
  const [editing, setEditing] = useState(false);
  const [editingItem, setEditingItem] = useState<number | null>(null);
  const [draft, setDraft] = useState(data);
  useEffect(() => { setDraft(data); }, [data]);

  const saveDesc = () => { onSave(draft); setEditing(false); };
  const saveItem = (i: number, item: AboutItem) => {
    const items = [...draft.aboutItems]; items[i] = item;
    const next = {...draft, aboutItems: items}; setDraft(next); onSave(next); setEditingItem(null);
  };
  const deleteItem = (i: number) => {
    const next = {...draft, aboutItems: draft.aboutItems.filter((_, idx) => idx !== i)};
    setDraft(next); onSave(next);
  };
  const addItem = () => {
    const next = {...draft, aboutItems: [...draft.aboutItems, {label: 'New', text: '', icon: 'MapIcon'}]};
    setDraft(next); setEditingItem(next.aboutItems.length - 1);
  };

  return (
    <section className="bg-neutral-800 px-4 py-16 md:py-24 lg:px-8">
      <div className="mx-auto max-w-screen-lg">
        <div className="grid grid-cols-1 gap-y-4 md:grid-cols-4">
          <div className="col-span-1 flex flex-col items-center gap-2 md:items-start">
            <div className="relative h-24 w-24 overflow-hidden rounded-xl md:h-96 md:w-44 bg-gray-700">
              {draft.profileImage && <img alt="profile" className="h-full w-full object-cover" src={draft.profileImage} />}
            </div>
            <ImageField label="Profile Image" onChange={v => { const next = {...draft, profileImage: v}; setDraft(next); onSave(next); }} value={draft.profileImage || ''} />
          </div>
          <div className="col-span-1 flex flex-col gap-y-6 md:col-span-3">
            <div className="relative flex flex-col gap-y-2">
              <Overlay onDelete={() => {}} onEdit={() => setEditing(true)} />
              <h2 className="text-2xl font-bold text-white">About me</h2>
              <p className="max-w-2xl prose-sm text-gray-300 sm:prose-base">{draft.description}</p>
            </div>
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {draft.aboutItems.map((item, i) => {
                const IconComp = ABOUT_ICON_MAP[item.icon];
                return (
                  <li className="relative col-span-1 flex items-start gap-x-2" key={i}>
                    <Overlay onDelete={() => deleteItem(i)} onEdit={() => setEditingItem(i)} />
                    {IconComp && <IconComp className="h-5 w-5 text-white" />}
                    <span className="text-sm font-bold text-white">{item.label}:</span>
                    <span className="text-sm text-gray-300">{item.text}</span>
                  </li>
                );
              })}
              <li><AddCard className="h-full min-h-[40px]" label="Add Fact" onClick={addItem} /></li>
            </ul>
          </div>
        </div>
      </div>
      {editing && (
        <Modal onClose={() => setEditing(false)} title="Edit About Description">
          <FLabel label="Description"><FTextArea onChange={v => setDraft({...draft, description: v})} rows={8} value={draft.description} /></FLabel>
          <SaveBtn onClick={saveDesc} />
        </Modal>
      )}
      {editingItem !== null && draft.aboutItems[editingItem] && (
        <AboutItemModal item={draft.aboutItems[editingItem]} onClose={() => setEditingItem(null)} onSave={item => saveItem(editingItem, item)} />
      )}
    </section>
  );
});

const AboutItemModal: FC<{item: AboutItem; onSave: (item: AboutItem) => void; onClose: () => void}> = ({item, onSave, onClose}) => {
  const [d, setD] = useState(item);
  return (
    <Modal onClose={onClose} title="Edit About Item">
      <FLabel label="Label"><FInput onChange={v => setD({...d, label: v})} placeholder="Location" value={d.label} /></FLabel>
      <FLabel label="Value"><FInput onChange={v => setD({...d, text: v})} placeholder="Kosova, XK" value={d.text} /></FLabel>
      <FLabel label="Icon"><FSelect onChange={v => setD({...d, icon: v})} options={ABOUT_ICON_OPTIONS} value={d.icon} /></FLabel>
      <SaveBtn onClick={() => onSave(d)} />
    </Modal>
  );
};

// ─── RESUME ──────────────────────────────────────────────
const AdminResume: FC<{
  experience: TimelineEntry[]; education: TimelineEntry[]; training: TimelineEntry[]; skills: SkillGroup[];
  onSave: (section: keyof PortfolioData, value: unknown) => void;
}> = memo(({experience, education, training, skills, onSave}) => (
  <section className="bg-neutral-100 px-4 py-16 md:py-24 lg:px-8">
    <div className="mx-auto max-w-screen-lg flex flex-col divide-y-2 divide-neutral-300">
      <AdminResumeSection items={experience} onSave={v => onSave('experience', v)} title="Work" />
      <AdminResumeSection items={education} onSave={v => onSave('education', v)} title="Education" />
      <AdminResumeSection items={training} onSave={v => onSave('training', v)} title="Trainings" />
      <AdminSkillsSection onSave={v => onSave('skills', v)} skills={skills} />
    </div>
  </section>
));

// Timeline section (Work, Education, Training)
const AdminResumeSection: FC<{title: string; items: TimelineEntry[]; onSave: (v: TimelineEntry[]) => void}> = memo(({title, items, onSave}) => {
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const deleteItem = (i: number) => onSave(items.filter((_, idx) => idx !== i));
  const moveItem = (i: number, dir: -1 | 1) => { if (i + dir >= 0 && i + dir < items.length) onSave(swap(items, i, i + dir)); };
  const addItem = () => { const next = [...items, {date: '', location: '', title: 'New Entry', content: ''}]; onSave(next); setEditIdx(next.length - 1); };
  const saveItem = (i: number, entry: TimelineEntry) => { const next = [...items]; next[i] = entry; onSave(next); setEditIdx(null); };

  return (
    <div className="grid grid-cols-1 gap-y-4 py-8 first:pt-0 last:pb-0 md:grid-cols-4">
      <div className="col-span-1 flex justify-center md:justify-start">
        <div className="relative h-max">
          <h2 className="text-xl font-bold uppercase text-neutral-800">{title}</h2>
          <span className="absolute inset-x-0 -bottom-1 border-b-2 border-orange-400" />
        </div>
      </div>
      <div className="col-span-1 flex flex-col md:col-span-3">
        {items.map((item, i) => (
          <div className="relative flex flex-col pb-8 text-center last:pb-0 md:text-left" key={i}>
            <OrderOverlay
              onDelete={() => deleteItem(i)}
              onEdit={() => setEditIdx(i)}
              onMoveDown={i < items.length - 1 ? () => moveItem(i, 1) : undefined}
              onMoveUp={i > 0 ? () => moveItem(i, -1) : undefined}
            />
            <div className="flex flex-col pb-4">
              <h2 className="text-xl font-bold">{item.title}</h2>
              <div className="flex items-center justify-center gap-x-2 md:justify-start">
                <span className="flex-1 text-sm font-medium italic sm:flex-none">{item.location}</span>
                <span>•</span>
                <span className="flex-1 text-sm sm:flex-none">{item.date}</span>
              </div>
            </div>
            <div dangerouslySetInnerHTML={{__html: item.content}} />
          </div>
        ))}
        <AddCard className="mt-4" label={`Add ${title} Entry`} onClick={addItem} />
      </div>
      {editIdx !== null && items[editIdx] && (
        <TimelineModal entry={items[editIdx]} onClose={() => setEditIdx(null)} onSave={e => saveItem(editIdx, e)} title={`Edit ${title}`} />
      )}
    </div>
  );
});

const TimelineModal: FC<{title: string; entry: TimelineEntry; onSave: (e: TimelineEntry) => void; onClose: () => void}> = ({title, entry, onSave, onClose}) => {
  const [d, setD] = useState(entry);
  return (
    <Modal onClose={onClose} title={title}>
      <FLabel label="Title / Position"><FInput onChange={v => setD({...d, title: v})} value={d.title} /></FLabel>
      <FLabel label="Company / Institution"><FInput onChange={v => setD({...d, location: v})} value={d.location} /></FLabel>
      <FLabel label="Date / Period"><FInput onChange={v => setD({...d, date: v})} placeholder="Jan 2022 - Present" value={d.date} /></FLabel>
      <FLabel label="Description">
        <RichTextEditor onChange={v => setD({...d, content: v})} value={d.content} />
      </FLabel>
      <SaveBtn onClick={() => onSave(d)} />
    </Modal>
  );
};

// Skills section
const AdminSkillsSection: FC<{skills: SkillGroup[]; onSave: (v: SkillGroup[]) => void}> = memo(({skills, onSave}) => {
  const [editGroup, setEditGroup] = useState<number | null>(null);
  const deleteGroup = (i: number) => onSave(skills.filter((_, idx) => idx !== i));
  const moveGroup = (i: number, dir: -1 | 1) => { if (i + dir >= 0 && i + dir < skills.length) onSave(swap(skills, i, i + dir)); };
  const addGroup = () => { const next = [...skills, {name: 'New Group', skills: [{name: 'New Skill', level: 5}]}]; onSave(next); setEditGroup(next.length - 1); };
  const saveGroup = (i: number, g: SkillGroup) => { const next = [...skills]; next[i] = g; onSave(next); setEditGroup(null); };

  return (
    <div className="grid grid-cols-1 gap-y-4 py-8 first:pt-0 last:pb-0 md:grid-cols-4">
      <div className="col-span-1 flex justify-center md:justify-start">
        <div className="relative h-max">
          <h2 className="text-xl font-bold uppercase text-neutral-800">Skills</h2>
          <span className="absolute inset-x-0 -bottom-1 border-b-2 border-orange-400" />
        </div>
      </div>
      <div className="col-span-1 flex flex-col md:col-span-3">
        <p className="pb-8">Here you can show a snapshot of your skills to show off to employers</p>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {skills.map((group, gi) => (
            <div className="relative flex flex-col" key={gi}>
              <OrderOverlay
                onDelete={() => deleteGroup(gi)}
                onEdit={() => setEditGroup(gi)}
                onMoveDown={gi < skills.length - 1 ? () => moveGroup(gi, 1) : undefined}
                onMoveUp={gi > 0 ? () => moveGroup(gi, -1) : undefined}
              />
              <span className="text-center text-lg font-bold">{group.name}</span>
              <div className="flex flex-col gap-y-2">
                {group.skills.map((skill, si) => (
                  <div className="flex flex-col" key={si}>
                    <span className="ml-2 text-sm font-medium">{skill.name}</span>
                    <div className="h-5 w-full overflow-hidden rounded-full bg-neutral-300">
                      <div className="h-full rounded-full bg-orange-400" style={{width: `${Math.round((skill.level / 10) * 100)}%`}} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <AddCard label="Add Skill Group" onClick={addGroup} />
        </div>
      </div>
      {editGroup !== null && skills[editGroup] && (
        <SkillGroupModal group={skills[editGroup]} onClose={() => setEditGroup(null)} onSave={g => saveGroup(editGroup, g)} />
      )}
    </div>
  );
});

const SkillGroupModal: FC<{group: SkillGroup; onSave: (g: SkillGroup) => void; onClose: () => void}> = ({group, onSave, onClose}) => {
  const [d, setD] = useState(group);
  const updateSkill = (i: number, field: keyof SkillEntry, val: string | number) => {
    const s = [...d.skills]; s[i] = {...s[i], [field]: val}; setD({...d, skills: s});
  };
  const moveSkill = (i: number, dir: -1 | 1) => { if (i + dir >= 0 && i + dir < d.skills.length) setD({...d, skills: swap(d.skills, i, i + dir)}); };
  const addSkill = () => setD({...d, skills: [...d.skills, {name: '', level: 5}]});
  const removeSkill = (i: number) => setD({...d, skills: d.skills.filter((_, idx) => idx !== i)});

  return (
    <Modal onClose={onClose} title="Edit Skill Group">
      <FLabel label="Group Name"><FInput onChange={v => setD({...d, name: v})} value={d.name} /></FLabel>
      <div className="mt-3 space-y-3">
        {d.skills.map((s, i) => (
          <div className="flex items-end gap-2 rounded-lg border border-gray-600 bg-gray-700/50 p-3" key={i}>
            <div className="flex flex-col gap-1">
              {i > 0 && <button className="rounded p-0.5 text-gray-400 hover:text-white" onClick={() => moveSkill(i, -1)} title="Move Up" type="button"><ChevronUpIcon className="h-3.5 w-3.5" /></button>}
              {i < d.skills.length - 1 && <button className="rounded p-0.5 text-gray-400 hover:text-white" onClick={() => moveSkill(i, 1)} title="Move Down" type="button"><ChevronDownIcon className="h-3.5 w-3.5" /></button>}
            </div>
            <div className="flex-1"><FLabel label="Skill"><FInput onChange={v => updateSkill(i, 'name', v)} value={s.name} /></FLabel></div>
            <div className="w-28">
              <FLabel label={`Level: ${s.level}/10`}>
                <input className="w-full accent-orange-500" max={10} min={1} onChange={e => updateSkill(i, 'level', Number(e.target.value))} type="range" value={s.level} />
              </FLabel>
            </div>
            <button className="mb-3 text-red-400 hover:text-red-300" onClick={() => removeSkill(i)} type="button"><XMarkIcon className="h-4 w-4" /></button>
          </div>
        ))}
        <button className="w-full rounded-lg border border-dashed border-gray-500 py-2 text-xs text-gray-400 hover:border-orange-500 hover:text-orange-400" onClick={addSkill} type="button">+ Add Skill</button>
      </div>
      <SaveBtn onClick={() => onSave(d)} />
    </Modal>
  );
};

// ─── PORTFOLIO ───────────────────────────────────────────
const AdminPortfolio: FC<{
  freelance: PortfolioItem[]; portfolio: PortfolioItem[];
  onSave: (section: keyof PortfolioData, value: unknown) => void;
}> = memo(({freelance, portfolio, onSave}) => (
  <section className="bg-neutral-800 px-4 py-16 md:py-24 lg:px-8">
    <div className="mx-auto max-w-screen-lg flex flex-col gap-y-8">
      <h2 className="self-center text-xl font-bold text-white">Check out some of my freelance work</h2>
      <PortfolioGrid items={freelance} onSave={v => onSave('freelancePortfolio', v)} />
      <h2 className="self-center text-xl font-bold text-white">My work at Harrisia</h2>
      <PortfolioGrid items={portfolio} onSave={v => onSave('portfolio', v)} />
    </div>
  </section>
));

const PortfolioGrid: FC<{items: PortfolioItem[]; onSave: (v: PortfolioItem[]) => void}> = memo(({items, onSave}) => {
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const deleteItem = (i: number) => onSave(items.filter((_, idx) => idx !== i));
  const moveItem = (i: number, dir: -1 | 1) => { if (i + dir >= 0 && i + dir < items.length) onSave(swap(items, i, i + dir)); };
  const addItem = () => { const next = [...items, {title: 'New Project', description: '', url: '', blur: false, background: 'transparent', image: ''}]; onSave(next); setEditIdx(next.length - 1); };
  const saveItem = (i: number, item: PortfolioItem) => { const next = [...items]; next[i] = item; onSave(next); setEditIdx(null); };

  return (
    <>
      <div className="w-full columns-2 md:columns-3 lg:columns-3">
        {items.map((item, i) => (
          <div className="pb-6" key={i}>
            <div className="relative flex min-h-[200px] items-center justify-center overflow-hidden rounded-lg shadow-lg shadow-black/30" style={{background: item.background}}>
              <OrderOverlay
                onDelete={() => deleteItem(i)}
                onEdit={() => setEditIdx(i)}
                onMoveDown={i < items.length - 1 ? () => moveItem(i, 1) : undefined}
                onMoveUp={i > 0 ? () => moveItem(i, -1) : undefined}
              />
              {item.image ? (
                <img alt={item.title} className="h-full w-full object-cover" src={String(item.image)} />
              ) : (
                <div className="flex h-48 w-full items-center justify-center bg-gray-700 text-gray-400">No Image</div>
              )}
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900/70 p-4 opacity-0 transition hover:opacity-100">
                <h3 className="font-bold text-white">{item.title}</h3>
                <p className="mt-1 text-xs text-gray-300">{item.description.slice(0, 100)}{item.description.length > 100 ? '...' : ''}</p>
              </div>
            </div>
          </div>
        ))}
        <div className="pb-6">
          <AddCard className="min-h-[200px]" label="Add Project" onClick={addItem} />
        </div>
      </div>
      {editIdx !== null && items[editIdx] && (
        <PortfolioModal item={items[editIdx]} onClose={() => setEditIdx(null)} onSave={item => saveItem(editIdx, item)} />
      )}
    </>
  );
});

const PortfolioModal: FC<{item: PortfolioItem; onSave: (item: PortfolioItem) => void; onClose: () => void}> = ({item, onSave, onClose}) => {
  const [d, setD] = useState(item);
  return (
    <Modal onClose={onClose} title="Edit Project">
      <FLabel label="Project Title"><FInput onChange={v => setD({...d, title: v})} value={d.title} /></FLabel>
      <FLabel label="Project URL"><FInput onChange={v => setD({...d, url: v})} placeholder="https://example.com" value={d.url} /></FLabel>
      <FLabel label="Description"><FTextArea onChange={v => setD({...d, description: v})} rows={4} value={d.description} /></FLabel>
      <ImageField label="Project Image" onChange={v => setD({...d, image: v})} value={String(d.image)} />
      <FLabel label="Background Color">
        <div className="flex gap-2">
          <FInput onChange={v => setD({...d, background: v})} value={d.background} />
          <div className="h-10 w-10 flex-shrink-0 rounded border border-gray-600" style={{backgroundColor: d.background}} />
        </div>
      </FLabel>
      <SaveBtn onClick={() => onSave(d)} />
    </Modal>
  );
};

// ─── TESTIMONIALS ────────────────────────────────────────
const AdminTestimonials: FC<{data: TestimonialItem[]; onSave: (d: TestimonialItem[]) => void}> = memo(({data, onSave}) => {
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const deleteItem = (i: number) => onSave(data.filter((_, idx) => idx !== i));
  const moveItem = (i: number, dir: -1 | 1) => { if (i + dir >= 0 && i + dir < data.length) onSave(swap(data, i, i + dir)); };
  const addItem = () => { const next = [...data, {name: 'New Client', text: '', image: ''}]; onSave(next); setEditIdx(next.length - 1); };
  const saveItem = (i: number, item: TestimonialItem) => { const next = [...data]; next[i] = item; onSave(next); setEditIdx(null); };

  return (
    <section className="flex w-full items-center justify-center bg-neutral-700 px-4 py-16 md:py-24 lg:px-8">
      <div className="w-full max-w-screen-md">
        <div className="flex flex-col items-center gap-y-6 rounded-xl bg-gray-800/60 p-6 shadow-lg">
          <div className="flex w-full flex-col gap-6">
            {data.map((t, i) => (
              <div className="relative flex w-full items-start gap-x-6 rounded-lg border border-gray-700 p-4" key={i}>
                <OrderOverlay
                  onDelete={() => deleteItem(i)}
                  onEdit={() => setEditIdx(i)}
                  onMoveDown={i < data.length - 1 ? () => moveItem(i, 1) : undefined}
                  onMoveUp={i > 0 ? () => moveItem(i, -1) : undefined}
                />
                {t.image ? (
                  <div className="relative h-14 w-14 shrink-0 sm:h-16 sm:w-16">
                    <QuoteIcon className="absolute -left-2 -top-2 h-4 w-4 stroke-black text-white" />
                    <img className="h-full w-full object-contain" src={t.image} />
                  </div>
                ) : (
                  <QuoteIcon className="h-8 w-8 shrink-0 text-white" />
                )}
                <div className="flex flex-col gap-y-2">
                  <p className="text-sm font-medium italic text-white">{t.text}</p>
                  <p className="text-xs italic text-gray-400">-- {t.name}</p>
                </div>
              </div>
            ))}
          </div>
          <AddCard label="Add Testimonial" onClick={addItem} />
        </div>
      </div>
      {editIdx !== null && data[editIdx] && (
        <TestimonialModal item={data[editIdx]} onClose={() => setEditIdx(null)} onSave={item => saveItem(editIdx, item)} />
      )}
    </section>
  );
});

const TestimonialModal: FC<{item: TestimonialItem; onSave: (item: TestimonialItem) => void; onClose: () => void}> = ({item, onSave, onClose}) => {
  const [d, setD] = useState(item);
  return (
    <Modal onClose={onClose} title="Edit Testimonial">
      <FLabel label="Client / Company Name"><FInput onChange={v => setD({...d, name: v})} value={d.name} /></FLabel>
      <FLabel label="Testimonial Text"><FTextArea onChange={v => setD({...d, text: v})} rows={4} value={d.text} /></FLabel>
      <ImageField label="Client Logo" onChange={v => setD({...d, image: v})} value={d.image} />
      <SaveBtn onClick={() => onSave(d)} />
    </Modal>
  );
};

// ─── CONTACT ─────────────────────────────────────────────
const AdminContact: FC<{data: ContactData; onSave: (d: ContactData) => void}> = memo(({data, onSave}) => {
  const [editingHeader, setEditingHeader] = useState(false);
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [draft, setDraft] = useState(data);
  useEffect(() => { setDraft(data); }, [data]);

  const deleteItem = (i: number) => { const next = {...draft, items: draft.items.filter((_, idx) => idx !== i)}; setDraft(next); onSave(next); };
  const addItem = () => { const next = {...draft, items: [...draft.items, {type: 'Email', text: '', href: ''}]}; setDraft(next); setEditIdx(next.items.length - 1); };
  const saveItem = (i: number, item: ContactItem) => { const items = [...draft.items]; items[i] = item; const next = {...draft, items}; setDraft(next); onSave(next); setEditIdx(null); };

  return (
    <section className="bg-neutral-800 px-4 py-16 md:py-24 lg:px-8">
      <div className="mx-auto max-w-screen-lg flex flex-col gap-y-6">
        <div className="relative flex flex-col gap-6 md:flex-row md:items-center">
          <Overlay onDelete={() => {}} onEdit={() => setEditingHeader(true)} />
          <EnvelopeIcon className="hidden h-16 w-16 text-white md:block" />
          <h2 className="text-2xl font-bold text-white">{draft.headerText}</h2>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="col-span-1">
            <p className="prose leading-6 text-neutral-300">{draft.description}</p>
          </div>
          <div className="col-span-1 flex flex-col gap-y-4">
            {draft.items.map((item, i) => {
              const IconComp = CONTACT_ICON_MAP[item.type];
              return (
                <div className="relative flex items-center" key={i}>
                  <Overlay onDelete={() => deleteItem(i)} onEdit={() => setEditIdx(i)} />
                  {IconComp && <IconComp className="h-5 w-5 flex-shrink-0 text-neutral-100" />}
                  <span className="ml-3 text-sm text-neutral-300">{item.text}</span>
                </div>
              );
            })}
            <AddCard className="mt-2" label="Add Contact Method" onClick={addItem} />
          </div>
        </div>
      </div>
      {editingHeader && (
        <Modal onClose={() => setEditingHeader(false)} title="Edit Contact Section">
          <FLabel label="Header Text"><FInput onChange={v => setDraft({...draft, headerText: v})} value={draft.headerText} /></FLabel>
          <FLabel label="Description"><FTextArea onChange={v => setDraft({...draft, description: v})} rows={4} value={draft.description} /></FLabel>
          <SaveBtn onClick={() => { onSave(draft); setEditingHeader(false); }} />
        </Modal>
      )}
      {editIdx !== null && draft.items[editIdx] && (
        <ContactItemModal item={draft.items[editIdx]} onClose={() => setEditIdx(null)} onSave={item => saveItem(editIdx, item)} />
      )}
    </section>
  );
});

const ContactItemModal: FC<{item: ContactItem; onSave: (item: ContactItem) => void; onClose: () => void}> = ({item, onSave, onClose}) => {
  const [d, setD] = useState(item);
  return (
    <Modal onClose={onClose} title="Edit Contact Method">
      <FLabel label="Type"><FSelect onChange={v => setD({...d, type: v})} options={CONTACT_TYPES} value={d.type} /></FLabel>
      <FLabel label="Display Text"><FInput onChange={v => setD({...d, text: v})} placeholder="@username" value={d.text} /></FLabel>
      <FLabel label="Link URL"><FInput onChange={v => setD({...d, href: v})} placeholder="https://..." value={d.href} /></FLabel>
      <SaveBtn onClick={() => onSave(d)} />
    </Modal>
  );
};

// ─── FOOTER / SOCIAL LINKS ──────────────────────────────
const AdminFooter: FC<{data: SocialLink[]; onSave: (d: SocialLink[]) => void}> = memo(({data, onSave}) => {
  const [items, setItems] = useState(data);
  const [editIdx, setEditIdx] = useState<number | null>(null);
  useEffect(() => { setItems(data); }, [data]);

  const deleteItem = (i: number) => { const next = items.filter((_, idx) => idx !== i); setItems(next); onSave(next); };
  const addItem = () => {
    const newItem: SocialLink = {label: 'New', icon: 'GithubIcon', href: ''};
    const next = [...items, newItem];
    setItems(next);
    onSave(next);
    setEditIdx(next.length - 1);
  };
  const saveItem = (i: number, item: SocialLink) => { const next = [...items]; next[i] = item; setItems(next); onSave(next); setEditIdx(null); };

  return (
    <div className="relative bg-neutral-900 px-4 pb-6 pt-12 sm:px-8 sm:pb-8 sm:pt-14">
      <div className="mx-auto max-w-screen-lg flex flex-col items-center gap-y-6">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500">Social Links</h3>
        <div className="flex w-full max-w-md flex-col gap-2">
          {items.map((link, i) => {
            const IconComp = SOCIAL_ICON_MAP[link.icon];
            return (
              <div className="flex items-center gap-3 rounded-lg border border-gray-700 bg-gray-800/50 px-4 py-3" key={i}>
                <span className="text-neutral-400">
                  {IconComp ? <IconComp className="h-5 w-5" /> : <span className="text-xs">{link.icon}</span>}
                </span>
                <span className="flex-1 text-sm text-gray-300">{link.label}</span>
                <span className="max-w-[150px] truncate text-xs text-gray-500">{link.href}</span>
                <div className="flex gap-1">
                  <button className="rounded p-1 text-orange-400 transition hover:bg-orange-600/20" onClick={() => setEditIdx(i)} title="Edit" type="button">
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  <button className="rounded p-1 text-red-400 transition hover:bg-red-600/20" onClick={() => deleteItem(i)} title="Delete" type="button">
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
          <button
            className="flex items-center justify-center gap-2 rounded-lg border border-dashed border-gray-600 py-3 text-sm text-gray-500 transition hover:border-orange-500 hover:text-orange-400"
            onClick={addItem} type="button">
            <PlusIcon className="h-4 w-4" /> Add Social Link
          </button>
        </div>
        <span className="text-sm text-neutral-700">© Copyright {new Date().getFullYear()} Arton Ramadani</span>
      </div>
      {editIdx !== null && items[editIdx] && (
        <SocialModal item={items[editIdx]} onClose={() => setEditIdx(null)} onSave={item => saveItem(editIdx, item)} />
      )}
    </div>
  );
});

const SocialModal: FC<{item: SocialLink; onSave: (item: SocialLink) => void; onClose: () => void}> = ({item, onSave, onClose}) => {
  const [d, setD] = useState(item);
  return (
    <Modal onClose={onClose} title="Edit Social Link">
      <FLabel label="Platform Name"><FInput onChange={v => setD({...d, label: v})} placeholder="LinkedIn" value={d.label} /></FLabel>
      <FLabel label="Icon"><FSelect onChange={v => setD({...d, icon: v})} options={SOCIAL_ICON_OPTIONS} value={d.icon} /></FLabel>
      <FLabel label="Profile URL"><FInput onChange={v => setD({...d, href: v})} placeholder="https://..." value={d.href} /></FLabel>
      <SaveBtn onClick={() => onSave(d)} />
    </Modal>
  );
};

export default AdminDashboard;
