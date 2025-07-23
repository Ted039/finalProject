import { useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/register', form);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg space-y-6 animate-fade-in"
        aria-label="Register form"
      >
        <div className="text-center">
          <h1 className="text-3xl font-bold text-indigo-700">SkillSwap</h1>
          <p className="text-sm text-gray-600 mt-1">Create your account and start swapping skills</p>
        </div>

        <label className="block text-sm font-medium text-gray-700">
          Username
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </label>

        <label className="block text-sm font-medium text-gray-700">
          Email
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </label>

        <label className="block text-sm font-medium text-gray-700">
          Password
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </label>

        {error && (
          <p className="text-red-600 text-sm text-center">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition duration-200"
        >
          {loading ? 'Creating account...' : 'Create Account'}
        </button>

        <p className="text-center text-sm text-gray-600">
          Already registered?{' '}
          <a href="/login" className="text-indigo-700 font-semibold hover:underline">
            Login here
          </a>
        </p>
      </form>
    </main>
  );
};

export default Register;
