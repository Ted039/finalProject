import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar.jsx'; // 
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import ProfileSettings from './pages/ProfileSettings.jsx';
import Discover from './pages/Discover.jsx';

const App = () => (
  <Router>
    <div className="flex min-h-screen">
      <Sidebar /> 
      <main className="ml-64 flex-1 bg-gray-100 p-6">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<ProfileSettings />} />
          <Route path="/discover" element={<Discover />} />
        </Routes>
      </main>
    </div>
  </Router>
);

export default App;
