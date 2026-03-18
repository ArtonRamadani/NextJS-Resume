import {FC, FormEvent, memo, useCallback, useEffect, useState} from 'react';

const AdminLogin: FC = memo(() => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [cooldownUntil, setCooldownUntil] = useState<string | null>(null);
  const [countdown, setCountdown] = useState('');

  useEffect(() => {
    // Check if already logged in
    const token = sessionStorage.getItem('adminToken');
    if (token) {
      fetch('/api/auth', {headers: {Authorization: `Bearer ${token}`}})
        .then(r => r.json())
        .then(d => {
          if (d.valid) window.location.href = '/admin';
        })
        .catch(() => {});
    }
  }, []);

  useEffect(() => {
    if (!cooldownUntil) {
      setCountdown('');
      return;
    }
    const interval = setInterval(() => {
      const remaining = new Date(cooldownUntil).getTime() - Date.now();
      if (remaining <= 0) {
        setCooldownUntil(null);
        setCountdown('');
        setError('');
        clearInterval(interval);
        return;
      }
      const min = Math.floor(remaining / 60000);
      const sec = Math.floor((remaining % 60000) / 1000);
      setCountdown(`${min}m ${sec}s`);
    }, 1000);
    return () => clearInterval(interval);
  }, [cooldownUntil]);

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      setError('');
      setLoading(true);

      try {
        const res = await fetch('/api/auth', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({username, password}),
        });
        const data = await res.json();

        if (res.ok) {
          sessionStorage.setItem('adminToken', data.token);
          window.location.href = '/admin';
        } else {
          setError(data.error);
          if (data.cooldownUntil) {
            setCooldownUntil(data.cooldownUntil);
          }
        }
      } catch {
        setError('Network error. Please try again.');
      } finally {
        setLoading(false);
      }
    },
    [username, password],
  );

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900">
      <div className="w-full max-w-md rounded-lg bg-gray-800 p-8 shadow-xl">
        <h1 className="mb-6 text-center text-2xl font-bold text-white">Admin Login</h1>

        {error && (
          <div className="mb-4 rounded border border-red-500 bg-red-900/50 p-3 text-sm text-red-300">{error}</div>
        )}

        {countdown && (
          <div className="mb-4 rounded border border-yellow-500 bg-yellow-900/50 p-3 text-center text-sm text-yellow-300">
            Cooldown remaining: {countdown}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="mb-1 block text-sm text-gray-300" htmlFor="username">
              Username
            </label>
            <input
              autoComplete="username"
              className="w-full rounded border border-gray-600 bg-gray-700 px-3 py-2 text-white focus:border-orange-500 focus:outline-none"
              disabled={!!cooldownUntil || loading}
              id="username"
              onChange={e => setUsername(e.target.value)}
              type="text"
              value={username}
            />
          </div>

          <div className="mb-6">
            <label className="mb-1 block text-sm text-gray-300" htmlFor="password">
              Password
            </label>
            <input
              autoComplete="current-password"
              className="w-full rounded border border-gray-600 bg-gray-700 px-3 py-2 text-white focus:border-orange-500 focus:outline-none"
              disabled={!!cooldownUntil || loading}
              id="password"
              onChange={e => setPassword(e.target.value)}
              type="password"
              value={password}
            />
          </div>

          <button
            className="w-full rounded bg-orange-600 py-2 font-semibold text-white transition hover:bg-orange-700 disabled:opacity-50"
            disabled={!!cooldownUntil || loading}
            type="submit">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
});

export default AdminLogin;
