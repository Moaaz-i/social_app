import {useState} from 'react'
import {Link, useLocation} from 'react-router-dom'
import {AppName} from './../../config'
import {FiHome, FiFileText, FiPlusCircle, FiMenu, FiX} from 'react-icons/fi'

const Navbar = ({ hide }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? "active" : "";
  };

  const navItems = [
    {path: '/', label: 'Home', icon: FiHome, show: true},
    {path: '/posts', label: 'Posts', icon: FiFileText, show: true},
    {path: '/posts/create', label: 'Create', icon: FiPlusCircle, show: true}
  ]

  return (
    <div className={`sticky top-0 z-50 ${hide ? 'hidden' : ''}`}>
      <nav className="bg-white/80 backdrop-blur-xl shadow-lg border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo/Brand */}
            <Link
              to="/"
              className="flex items-center gap-3 group"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white font-black text-xl">
                    {AppName[0]}
                  </span>
                </div>
              </div>
              <div className="hidden sm:block">
                <span className="font-black text-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
                  {AppName}
                </span>
                <p className="text-xs text-gray-500 font-medium">Social Network</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-2">
              {navItems
                .filter((item) => item.show)
                .map((item) => {
                  const Icon = item.icon
                  const active = isActive(item.path)
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`relative flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 group ${
                        active
                          ? 'text-white'
                          : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                      }`}
                    >
                      {active && (
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg"></div>
                      )}
                      <Icon className={`relative z-10 w-5 h-5 ${active ? 'text-white' : 'group-hover:scale-110 transition-transform'}`} />
                      <span className="relative z-10">{item.label}</span>
                      {active && (
                        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full"></div>
                      )}
                    </Link>
                  )
                })}
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-3">
              {/* Create Post Button - Desktop */}
              <Link
                to="/posts/create"
                className="hidden md:flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                <FiPlusCircle className="w-5 h-5" />
                <span>Create Post</span>
              </Link>

              {/* Mobile Menu Button */}
              <button
                className="md:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMenuOpen ? (
                  <FiX className="w-6 h-6 text-gray-700" />
                ) : (
                  <FiMenu className="w-6 h-6 text-gray-700" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white/95 backdrop-blur-xl">
            <div className="px-4 py-4 space-y-2">
              {navItems
                .filter((item) => item.show)
                .map((item) => {
                  const Icon = item.icon
                  const active = isActive(item.path)
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${
                        active
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                          : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </Link>
                  )
                })}
            </div>
          </div>
        )}
      </nav>
    </div>
  )
}

export default Navbar
