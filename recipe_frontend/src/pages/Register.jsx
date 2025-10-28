import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// PUBLIC_INTERFACE
export default function Register() {
  /** Registration screen; on success, redirect to login */
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', full_name: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const [ok, setOk] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr('');
    setOk(false);
    setLoading(true);
    try {
      await register(form);
      setOk(true);
      setTimeout(() => navigate('/login'), 800);
    } catch (error) {
      setErr(error?.response?.data?.detail || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="center-page">
      <div className="panel">
        <h1 className="title">Create your account</h1>
        <p className="subtitle">Join RecipeHub today</p>
        {err && <div className="alert error">{err}</div>}
        {ok && <div className="alert success">Account created. Redirecting to login…</div>}
        <form onSubmit={onSubmit} className="form">
          <label>
            Full name
            <input
              type="text"
              value={form.full_name}
              onChange={(e) => setForm((s) => ({ ...s, full_name: e.target.value }))}
              placeholder="Optional"
            />
          </label>
          <label>
            Email
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))}
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm((s) => ({ ...s, password: e.target.value }))}
              required
            />
          </label>
          <button className="btn-primary btn-large" type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Account'}
          </button>
        </form>
        <p className="muted mt-2">
          Already have an account? <Link to="/login" className="link">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
