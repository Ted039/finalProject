import { useState, useContext } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const { login } = useContext(AuthContext);
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/auth/login', form);
      login(res.data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-green-100">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md p-8 bg-white shadow-xl rounded-lg space-y-6 animate-fade-in"
        aria-label="Login form"
      >
        <div className="text-center">
          <h1 className="text-3xl font-bold text-green-700">SkillSwap</h1>
          <p className="text-sm text-gray-600 mt-1">Where skills meet conversations</p>
        </div>

        <label className="block text-sm font-medium text-gray-700">
          Email
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
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
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
          />
        </label>

        {error && (
          <p className="text-red-600 text-sm text-center">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 transition duration-200"
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>

        <p className="text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <a href="/register" className="text-green-700 font-semibold hover:underline">
            Register here
          </a>
        </p>
      </form>
    </main>
  );
};

export default Login;
