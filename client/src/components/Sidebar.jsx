import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const { pathname } = useLocation();

  const navLinks = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/profile', label: 'Profile Settings' },
    { path: '/', label: 'Logout' }, // optional: can trigger logout function
  ];

  return (
    <aside className="w-64 h-screen bg-gray-800 text-white p-6 fixed top-0 left-0">
      <h2 className="text-xl font-bold mb-6">SkillSwap </h2>
      <nav className="space-y-4">
        {navLinks.map(({ path, label }) => (
          <Link
            key={path}
            to={path}
            className={`block px-3 py-2 rounded ${
              pathname === path ? 'bg-gray-700' : 'hover:bg-gray-700'
            }`}
          >
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
