import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../lib/AuthContent';
import './AdminLogin.css';

export default function AdminLogin() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  if (user) {
    navigate('/admin/dashboard');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    setSubmitting(false);

    if (error) {
      setError('Login failed, are you sure you are not an outsider?');
      return;
    }

    navigate('/admin/dashboard');
  };

  return (
    <div className="admin-login">
      <form className="admin-login-form" onSubmit={handleSubmit}>
        <p className="admin-login-label">Staff Entrance</p>
        <h1 className="admin-login-title">Sign In</h1>

        <label className="admin-field">
          <span>Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="username"
            disabled={submitting}
          />
        </label>

        <label className="admin-field">
          <span>Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            disabled={submitting}
          />
        </label>

        {error && <p className="admin-error">{error}</p>}

        <button type="submit" className="admin-submit" disabled={submitting}>
          {submitting ? 'Signing in…' : 'Sign In'}
        </button>
      <p className="admin-hint">Don't know what your credential is? Please stop loitering around.</p>
      </form>
    </div>
  );
}