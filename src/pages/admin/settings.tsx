import Link from 'next/link';
import {FC, memo, useCallback, useEffect, useState} from 'react';

function getToken(): string | null {
  return typeof window !== 'undefined' ? sessionStorage.getItem('adminToken') : null;
}
async function authFetch(url: string, opts: RequestInit = {}) {
  return fetch(url, {...opts, headers: {'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}`, ...opts.headers}});
}

interface MetaData {
  title: string; description: string; keywords: string; author: string;
  ogTitle: string; ogDescription: string; ogImage: string; ogUrl: string;
  twitterCard: string; aiDescription: string;
}
interface LogEntry { timestamp: string; ip: string; success: boolean; username: string }

const SettingsPage: FC = memo(() => {
  const [meta, setMeta] = useState<MetaData | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    const token = getToken();
    if (!token) { window.location.href = '/admin/login'; return; }
    authFetch('/api/auth').then(r => { if (!r.ok) throw new Error(); return Promise.all([
      authFetch('/api/portfolio-data').then(r => r.json()),
      authFetch('/api/login-logs').then(r => r.json()),
    ]); })
    .then(([data, logsData]) => { setMeta(data.meta); setLogs(logsData); })
    .catch(() => { sessionStorage.removeItem('adminToken'); window.location.href = '/admin/login'; });
  }, []);

  const saveMeta = useCallback(async () => {
    if (!meta) return;
    const res = await authFetch('/api/portfolio-data', {method: 'PUT', body: JSON.stringify({section: 'meta', data: meta})});
    setToast(res.ok ? '✓ Saved!' : '✕ Failed'); setTimeout(() => setToast(null), 2500);
  }, [meta]);

  if (!meta) return <div className="flex min-h-screen items-center justify-center bg-gray-900 text-gray-400">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Top bar */}
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-gray-700 bg-gray-900/95 px-6 py-3 backdrop-blur">
        <div className="flex items-center gap-3">
          <span className="text-lg font-bold text-white">⚙️ Settings</span>
          {toast && <span className={`text-xs ${toast.startsWith('✓') ? 'text-green-400' : 'text-red-400'}`}>{toast}</span>}
        </div>
        <Link className="text-sm text-gray-400 transition hover:text-white" href="/admin">← Back to Admin</Link>
      </div>

      <div className="mx-auto max-w-3xl space-y-8 p-6">
        {/* Site Meta & SEO */}
        <div className="rounded-xl border border-gray-700 bg-gray-800 p-6">
          <h2 className="mb-4 text-lg font-bold text-white">Site Settings & SEO</h2>
          <p className="mb-4 text-sm text-gray-400">Controls your site&apos;s title, meta tags, Open Graph, Twitter Card, and AI/LLM description.</p>

          <div className="space-y-4">
            {/* Basic */}
            <h3 className="text-sm font-semibold text-orange-400">Basic</h3>
            <Field label="Site Title" value={meta.title} onChange={v => setMeta({...meta, title: v})} />
            <Field label="SEO Description" value={meta.description} onChange={v => setMeta({...meta, description: v})} textarea />
            <Field label="Keywords (comma-separated)" value={meta.keywords || ''} onChange={v => setMeta({...meta, keywords: v})} />
            <Field label="Author" value={meta.author || ''} onChange={v => setMeta({...meta, author: v})} />

            {/* Open Graph */}
            <h3 className="mt-2 text-sm font-semibold text-orange-400">Open Graph (Social Sharing)</h3>
            <Field label="OG Title" value={meta.ogTitle || ''} onChange={v => setMeta({...meta, ogTitle: v})} placeholder="Falls back to Site Title" />
            <Field label="OG Description" value={meta.ogDescription || ''} onChange={v => setMeta({...meta, ogDescription: v})} textarea placeholder="Falls back to SEO Description" />
            <Field label="OG Image URL" value={meta.ogImage || ''} onChange={v => setMeta({...meta, ogImage: v})} placeholder="https://..." />
            <Field label="OG / Canonical URL" value={meta.ogUrl || ''} onChange={v => setMeta({...meta, ogUrl: v})} placeholder="https://your-domain.com/" />

            {/* Twitter */}
            <h3 className="mt-2 text-sm font-semibold text-orange-400">Twitter Card</h3>
            <div className="mb-1">
              <label className="mb-1 block text-xs font-medium text-gray-400">Card Type</label>
              <select className="w-full rounded-lg border border-gray-600 bg-gray-700 px-3 py-2 text-sm text-white focus:border-orange-500 focus:outline-none" onChange={e => setMeta({...meta, twitterCard: e.target.value})} value={meta.twitterCard || 'summary_large_image'}>
                <option value="summary_large_image">summary_large_image</option>
                <option value="summary">summary</option>
              </select>
            </div>

            {/* AI / LLM */}
            <h3 className="mt-2 text-sm font-semibold text-orange-400">AI / LLM Description</h3>
            <Field label="AI Description" value={meta.aiDescription || ''} onChange={v => setMeta({...meta, aiDescription: v})} textarea rows={5} placeholder="A detailed description for AI crawlers and LLMs..." />
          </div>

          <button className="mt-4 rounded-lg bg-orange-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-orange-700" onClick={saveMeta} type="button">Save</button>
        </div>

        {/* Change Password */}
        <ChangePasswordCard />

        {/* Login Logs */}
        <div className="rounded-xl border border-gray-700 bg-gray-800 p-6">
          <h2 className="mb-1 text-lg font-bold text-white">Login Logs</h2>
          <p className="mb-4 text-xs text-gray-500">These logs are permanent and cannot be deleted.</p>
          {logs.length === 0 ? (
            <p className="py-4 text-center text-gray-500">No login attempts recorded yet.</p>
          ) : (
            <div className="max-h-96 overflow-y-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-600 text-left text-xs uppercase text-gray-500">
                    <th className="pb-2 pr-4">Time</th><th className="pb-2 pr-4">Username</th><th className="pb-2 pr-4">IP</th><th className="pb-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log, i) => (
                    <tr className="border-b border-gray-700/50" key={i}>
                      <td className="py-2 pr-4 text-gray-300">{new Date(log.timestamp).toLocaleString()}</td>
                      <td className="py-2 pr-4 text-gray-300">{log.username}</td>
                      <td className="py-2 pr-4 font-mono text-xs text-gray-400">{log.ip}</td>
                      <td className="py-2">
                        <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${log.success ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'}`}>
                          {log.success ? 'Success' : 'Failed'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

const Field: FC<{label: string; value: string; onChange: (v: string) => void; textarea?: boolean; rows?: number; placeholder?: string}> = ({label, value, onChange, textarea, rows = 2, placeholder}) => (
  <div>
    <label className="mb-1 block text-xs font-medium text-gray-400">{label}</label>
    {textarea ? (
      <textarea className="w-full rounded-lg border border-gray-600 bg-gray-700 px-3 py-2 text-sm text-white focus:border-orange-500 focus:outline-none" onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows} value={value} />
    ) : (
      <input className="w-full rounded-lg border border-gray-600 bg-gray-700 px-3 py-2 text-sm text-white focus:border-orange-500 focus:outline-none" onChange={e => onChange(e.target.value)} placeholder={placeholder} value={value} />
    )}
  </div>
);

const ChangePasswordCard: FC = memo(() => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [open, setOpen] = useState(false);

  const handleSubmit = useCallback(async () => {
    setError('');
    if (newPassword !== confirmPassword) { setError('Passwords do not match.'); return; }
    if (newPassword.length < 6) { setError('Password must be at least 6 characters.'); return; }
    try {
      const res = await authFetch('/api/change-password', {method: 'POST', body: JSON.stringify({currentPassword, newPassword})});
      const d = await res.json();
      if (res.ok) { setSuccess(true); setCurrentPassword(''); setNewPassword(''); setConfirmPassword(''); setTimeout(() => setSuccess(false), 3000); }
      else setError(d.error);
    } catch { setError('Network error.'); }
  }, [currentPassword, newPassword, confirmPassword]);

  return (
    <div className="rounded-xl border border-gray-700 bg-gray-800 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-white">Change Password</h2>
        <button className="text-sm text-orange-400 hover:text-orange-300" onClick={() => setOpen(!open)} type="button">
          {open ? 'Cancel' : 'Change'}
        </button>
      </div>
      {open && (
        <div className="mt-4 space-y-3">
          {error && <div className="rounded-lg border border-red-500 bg-red-900/50 p-3 text-sm text-red-300">{error}</div>}
          {success && <div className="rounded-lg border border-green-500 bg-green-900/50 p-3 text-sm text-green-300">Password changed successfully!</div>}
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-400">Current Password</label>
            <input className="w-full rounded-lg border border-gray-600 bg-gray-700 px-3 py-2 text-sm text-white focus:border-orange-500 focus:outline-none" onChange={e => setCurrentPassword(e.target.value)} type="password" value={currentPassword} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-400">New Password</label>
            <input className="w-full rounded-lg border border-gray-600 bg-gray-700 px-3 py-2 text-sm text-white focus:border-orange-500 focus:outline-none" onChange={e => setNewPassword(e.target.value)} type="password" value={newPassword} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-400">Confirm New Password</label>
            <input className="w-full rounded-lg border border-gray-600 bg-gray-700 px-3 py-2 text-sm text-white focus:border-orange-500 focus:outline-none" onChange={e => setConfirmPassword(e.target.value)} type="password" value={confirmPassword} />
          </div>
          <button className="rounded-lg bg-orange-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-orange-700" onClick={handleSubmit} type="button">Update Password</button>
        </div>
      )}
    </div>
  );
});

export default SettingsPage;
