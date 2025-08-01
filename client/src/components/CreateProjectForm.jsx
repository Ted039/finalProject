import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

function CreateProjectForm() {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('General');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const handleCreate = async () => {
    if (!token) {
      alert('Authentication required');
      return;
    }

    if (!title.trim()) {
      alert('Project title is required');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/projects', {
        title,
        category,
        description,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const newProject = response.data;
      navigate(`/projects/${newProject._id}`); // 🎯 Redirect to collab workspace
    } catch (err) {
      console.error('Failed to create project:', err);
      alert('Something went wrong while creating your project.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded shadow max-w-3xl mx-auto">
      <h2 className="text-xl font-semibold mb-4 dark:text-white">Start a New Collaboration</h2>

      <input
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Project Title"
        className="mb-4 w-full px-4 py-2 border rounded dark:bg-gray-900 dark:text-white"
      />

      <select
        value={category}
        onChange={e => setCategory(e.target.value)}
        className="mb-4 w-full px-4 py-2 border rounded dark:bg-gray-900 dark:text-white"
      >
        <option>Design</option>
        <option>Marketing</option>
        <option>Programming</option>
        <option>Writing</option>
        <option>Business Strategy</option>
        <option>Other</option>
      </select>

      <textarea
        rows={4}
        value={description}
        onChange={e => setDescription(e.target.value)}
        placeholder="What’s the goal of your project?"
        className="mb-4 w-full px-4 py-2 border rounded dark:bg-gray-900 dark:text-white"
      />

      <button
        onClick={handleCreate}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Creating...' : 'Create Project'}
      </button>
    </div>
  );
}

export default CreateProjectForm;
