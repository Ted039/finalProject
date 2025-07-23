import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const { pathname } = useLocation();

  const navLinks = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/discover', label: 'Discover' },
    { path: '/messages', label: 'Messages' },       
    { path: '/profile', label: 'Settings' },
  ];

  return (
    <aside className="w-64 h-screen bg-gray-800 text-white p-6 fixed top-0 left-0">
      <h2 className="text-xl font-bold mb-6">SkillSwap</h2>

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

      {/* Logout placed separately for clarity */}
      <div className="mt-10 border-t pt-4">
        <Link
          to="/"
          className={`block px-3 py-2 rounded ${
            pathname === '/' ? 'bg-gray-700' : 'hover:bg-gray-700'
          }`}
        >
          Logout
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
