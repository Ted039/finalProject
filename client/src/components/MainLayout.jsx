import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';

const MainLayout = ({ children }) => (
  <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 text-black dark:text-white transition-colors duration-300">
    <Navbar />
    <div className="flex-1">{children}</div>
    <Footer />
  </div>
);

export default MainLayout;
