import { useEffect, useState } from 'react';
import api from '../api/axios';

function StartedProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const token = localStorage.getItem('token');
  const limit = 5;

  const fetchProjects = async (page = 1) => {
    setLoading(true);
    try {
      const res = await api.get(`/projects?page=${page}&limit=${limit}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjects(res.data.projects);
      setCurrentPage(res.data.page);
      setTotalPages(res.data.pages);
    } catch (err) {
      console.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handlePrevious = () => {
    if (currentPage > 1) fetchProjects(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) fetchProjects(currentPage + 1);
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white dark:bg-gray-800 rounded shadow">
      <h2 className="text-2xl font-semibold dark:text-white mb-4">Started Projects</h2>
      {loading ? (
        <p className="text-gray-500">Loading your projects...</p>
      ) : projects.length === 0 ? (
        <p className="text-gray-500">No active projects yet.</p>
      ) : (
        <>
          <ul className="space-y-4">
            {projects.map((proj) => (
              <li key={proj._id} className="p-4 bg-gray-100 dark:bg-gray-700 rounded">
                <p className="font-medium">{proj.title || 'Untitled Project'}</p>
                <p className="text-sm text-gray-500">
                  Partner: {proj.partner?.username || 'Unknown'} | Skill: {proj.skill}
                </p>
                <p className="text-sm text-gray-500">Started: {new Date(proj.startedAt).toLocaleDateString()}</p>
                <p className="text-sm text-gray-500">Status: {proj.status || 'In Progress'}</p>
              </li>
            ))}
          </ul>

          {/* Pagination Controls */}
          <div className="mt-6 flex justify-between items-center text-sm text-gray-600 dark:text-gray-300">
            <button
              onClick={handlePrevious}
              disabled={currentPage <= 1}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNext}
              disabled={currentPage >= totalPages}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default StartedProjects;
