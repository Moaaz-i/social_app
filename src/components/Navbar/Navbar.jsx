import {useState, useEffect} from 'react'
import {Link, useLocation} from 'react-router-dom'
import {AppName} from './../../config'
import {FiHome, FiFileText, FiPlusCircle, FiMenu, FiX, FiSun, FiMoon, FiBell} from 'react-icons/fi'
import {toast} from 'react-hot-toast'

const Navbar = ({hide}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()
  
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light')

  // Notification Center States
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('notifications')
    return saved ? JSON.parse(saved) : [
      { id: 1, text: "👋 Welcome to Linked Post! Start sharing your thoughts.", read: false, time: "Just now" }
    ]
  })
  const [showNotifications, setShowNotifications] = useState(false)

  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications))
  }, [notifications])

  // Live simulation of notifications in background
  useEffect(() => {
    const interval = setInterval(() => {
      const mockNotifications = [
        "❤️ Sarah Connor liked your post",
        "💬 John Doe commented: 'Amazing writeup!'",
        "👤 Alice Cooper followed you",
        "🚀 Admin User pinned a new post",
        "🔥 Your post is trending in #reactjs!"
      ]
      const randomText = mockNotifications[Math.floor(Math.random() * mockNotifications.length)]
      const newNotif = {
        id: Date.now(),
        text: randomText,
        read: false,
        time: "1m ago"
      }
      setNotifications(prev => [newNotif, ...prev].slice(0, 10))
      toast(randomText, {
        icon: '🔔',
        style: {
          borderRadius: '16px',
          background: '#1e293b',
          color: '#fff',
        },
      })
    }, 45000)

    return () => clearInterval(interval)
  }, [])

  const unreadCount = notifications.filter(n => !n.read).length

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [theme])

  const isActive = (path) => {
    return location.pathname === path ? 'active' : ''
  }

  const navItems = [
    {path: '/', label: 'Home', icon: FiHome, show: true},
    {path: '/posts', label: 'Posts', icon: FiFileText, show: true}
  ]

  return (
    <div className={`sticky top-0 z-50 ${hide ? 'hidden' : ''}`}>
      <nav className="bg-white/80 backdrop-blur-xl shadow-lg border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo/Brand */}
            <Link to="/" className="flex items-center gap-3 group">
              <img src="/logo.png" alt="Logo" className="w-12 h-12 object-contain transform group-hover:scale-110 transition-transform duration-300" />
              <div className="hidden sm:block">
                <span className="font-black text-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
                  {AppName}
                </span>
                <p className="text-xs text-gray-500 font-medium">
                  Social Network
                </p>
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
                      <Icon
                        className={`relative z-10 w-5 h-5 ${
                          active
                            ? 'text-white'
                            : 'group-hover:scale-110 transition-transform'
                        }`}
                      />
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
              {/* Theme Toggle */}
              <button
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                className="p-2.5 rounded-xl hover:bg-gray-100 text-gray-600 transition-colors cursor-pointer"
                title="Toggle Theme"
              >
                {theme === 'light' ? <FiMoon className="w-5 h-5" /> : <FiSun className="w-5 h-5" />}
              </button>

              {/* Notification Bell */}
              <div className="relative">
                <button
                  onClick={() => {
                    setShowNotifications(!showNotifications)
                    markAllAsRead()
                  }}
                  className="relative p-2.5 rounded-xl hover:bg-gray-100 text-gray-600 transition-colors cursor-pointer"
                  title="Notifications"
                >
                  <FiBell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-4.5 h-4.5 bg-red-500 text-[10px] font-black text-white rounded-full flex items-center justify-center animate-bounce">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-slate-700 py-3 z-50 animate-fadeIn">
                    <div className="flex justify-between items-center px-4 pb-2 border-b border-gray-100 dark:border-slate-700">
                      <span className="font-bold text-sm text-gray-800 dark:text-white">Notifications</span>
                      <button
                        onClick={() => setNotifications([])}
                        className="text-xs text-blue-600 hover:text-blue-700 font-bold"
                      >
                        Clear all
                      </button>
                    </div>
                    <div className="max-h-64 overflow-y-auto mt-2 px-2 space-y-1">
                      {notifications.length === 0 ? (
                        <p className="text-xs text-gray-400 font-medium text-center py-6">
                          No notifications yet
                        </p>
                      ) : (
                        notifications.map((n) => (
                          <div
                            key={n.id}
                            className={`p-3 rounded-xl text-xs leading-relaxed transition-colors ${
                              n.read ? 'text-gray-600 dark:text-gray-400' : 'bg-blue-50/50 dark:bg-slate-700/50 text-gray-800 dark:text-white font-semibold'
                            }`}
                          >
                            {n.text}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

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
