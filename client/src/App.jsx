import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar.jsx'; // 👈 Sidebar component
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import ProfileSettings from './pages/ProfileSettings.jsx'; // ✅ corrected import

const App = () => (
  <Router>
    <div className="flex min-h-screen">
      <Sidebar /> {/* ✅ Sidebar stays fixed on the left */}
      <main className="ml-64 flex-1 bg-gray-100 p-6">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<ProfileSettings />} />
        </Routes>
      </main>
    </div>
  </Router>
);

export default App;
