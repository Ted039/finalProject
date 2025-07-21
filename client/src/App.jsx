import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Sidebar from './components/Sidebar.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

// Pages
import Dashboard from './pages/Dashboard.jsx';
import Discover from './pages/Discover.jsx';
import Login from './pages/Login.jsx';
import Messages from './pages/Messages.jsx';
import ProfileSettings from './pages/ProfileSettings.jsx';
import Register from './pages/Register.jsx';
import Requests from './pages/Request.jsx';
import SwapRequest from './pages/swapRequests.jsx';
import DirectMessage from './pages/DirectMessage.jsx'; // ✅ Newly added

const AppLayout = () => {
  const { pathname } = useLocation();
  const hideSidebar = ['/', '/login', '/register'].includes(pathname);

  return (
    <div className="bg-white text-black dark:bg-gray-900 dark:text-white min-h-screen transition-colors duration-300">
      <Toaster position="top-right" />
      <div className="flex min-h-screen">
        {!hideSidebar && <Sidebar />}
        <main className={`${!hideSidebar ? 'ml-64' : ''} flex-1 p-6`}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/discover"
              element={
                <ProtectedRoute>
                  <Discover />
                </ProtectedRoute>
              }
            />
            <Route
              path="/messages"
              element={
                <ProtectedRoute>
                  <Messages />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dm/:receiverId"
              element={
                <ProtectedRoute>
                  <DirectMessage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfileSettings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/requests"
              element={
                <ProtectedRoute>
                  <Requests />
                </ProtectedRoute>
              }
            />
            {/* 🔧 Optional: Add missing route */}
            {/* <Route path="/swaps" element={<SwapRequest />} /> */}
          </Routes>
        </main>
      </div>
    </div>
  );
};

const App = () => (
  <Router>
    <AppLayout />
  </Router>
);

export default App;
