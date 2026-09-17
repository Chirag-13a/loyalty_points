import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';

export function AuthPage({ mode }) {
  const isRegister = mode === 'register';
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const submit = async (event) => {
    event.preventDefault();
    setError('');

    try {
      const endpoint = isRegister ? '/auth/register' : '/auth/login';
      const payload = isRegister
        ? form
        : {
            email: form.email,
            password: form.password,
          };
      const { data } = await api.post(endpoint, payload);
      localStorage.setItem('token', data.token);
      localStorage.setItem('staffUser', JSON.stringify(data.user));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed');
    }
  };

  return (
    <div className="mx-auto max-w-md rounded-2xl bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-bold">{isRegister ? 'Create Staff Account' : 'Staff Login'}</h1>
      <form className="mt-4 space-y-3" onSubmit={submit}>
        {isRegister && (
          <input
            className="w-full rounded-xl border border-[#d9c6af] px-3 py-2"
            placeholder="Full name"
            value={form.name}
            onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
            required
          />
        )}
        <input
          className="w-full rounded-xl border border-[#d9c6af] px-3 py-2"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
          required
        />
        <input
          className="w-full rounded-xl border border-[#d9c6af] px-3 py-2"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
          required
          minLength={6}
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button type="submit" className="w-full rounded-xl bg-[#C97B4A] px-4 py-2 font-semibold text-white">
          {isRegister ? 'Register' : 'Login'}
        </button>
      </form>
    </div>
  );
}
