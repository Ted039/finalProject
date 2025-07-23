const Footer = () => (
  <footer className="bg-gradient-to-r from-green-600 to-green-700 dark:from-gray-800 dark:to-gray-900 text-center text-sm text-white dark:text-gray-300 py-6 mt-12 shadow-inner">
    <p className="font-medium tracking-wide">
      © {new Date().getFullYear()} <span className="font-bold">SkillSwap</span> &mdash; Learn • Teach • Connect
    </p>
    <div className="mt-2 space-x-4 text-xs text-gray-200 dark:text-gray-400">
      <a href="https://skillswap-omega-eight.vercel.app/" target="_blank" rel="noopener noreferrer" className="hover:underline">
        Live App
      </a>
      <a href="https://github.com/Ted039/finalProject" target="_blank" rel="noopener noreferrer" className="hover:underline">
        GitHub
      </a>
      <a href="mailto:owinoteddy1997@gmail.com" className="hover:underline">
        Contact
      </a>
    </div>
  </footer>
)

export default Footer
