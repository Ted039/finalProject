import { useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', form);
      navigate('/login');
    } catch (err) {
      alert(err.response?.data.message || 'Registration failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto mt-20 p-6 bg-white shadow-md rounded-md space-y-4">
        <h2 className="text-xl font-semibold text-center">Register</h2>
        <input name="username" placeholder="Username"
            className="w-full border px-3 py-2 rounded" onChange={handleChange} />
        <input name="email" placeholder="Email"
            className="w-full border px-3 py-2 rounded" onChange={handleChange} />
        <input name="password" type="password" placeholder="Password"
            className="w-full border px-3 py-2 rounded" onChange={handleChange} />
        <button type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
            Create Account
        </button>

        <p className="text-center mt-4 text-sm">
            Already registered?{' '}
            <a href="/" className="text-blue-600 hover:underline">
                Login here
            </a>
        </p>

    </form>

  );
};

export default Register;
