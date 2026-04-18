import React, { useContext, useEffect, useRef, useState } from 'react'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const Navbar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { token, setToken, userData } = useContext(AppContext)
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropOpen, setDropOpen] = useState(false)
  const dropRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const handler = (e) => { if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  useEffect(() => { setMenuOpen(false) }, [location])

  const logout = () => {
    localStorage.removeItem('token')
    setToken(false)
    setDropOpen(false)
    navigate('/login')
  }

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/doctors', label: 'Doctors' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
  ]

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'glass shadow-card' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">

        {/* Logo */}
        <div onClick={() => navigate('/')} className="flex items-center gap-2.5 cursor-pointer group">
          <div className="w-9 h-9 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-md group-hover:shadow-glow transition-all duration-300">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" fill="white"/>
              <path d="M11 8h2v8h-2zM7 10h2v4H7zM15 10h2v4h-2z" fill="rgba(255,255,255,0.4)"/>
            </svg>
          </div>
          <span className="text-xl font-display font-800 text-gray-900 tracking-tight">Prescripto</span>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map(({ to, label }) => (
            <NavLink key={to} to={to}
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive ? 'bg-primary-light text-primary' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`
              }
            >{label}</NavLink>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {token && userData ? (
            <div ref={dropRef} className="relative">
              <button onClick={() => setDropOpen(!dropOpen)}
                className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full border border-gray-200 hover:border-primary hover:bg-primary-light transition-all duration-200">
                <img src={userData.image} alt="avatar"
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-primary/20" />
                <span className="text-sm font-medium text-gray-700 hidden sm:block max-w-[90px] truncate">
                  {userData.name?.split(' ')[0]}
                </span>
                <svg className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${dropOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {dropOpen && (
                <div className="absolute right-0 mt-2 w-52 glass rounded-2xl shadow-card-hover py-2 animate-fadeIn">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-xs text-gray-500">Signed in as</p>
                    <p className="text-sm font-semibold text-gray-800 truncate">{userData.name}</p>
                  </div>
                  {[
                    { label: 'My Profile', icon: '👤', path: '/my-profile' },
                    { label: 'My Appointments', icon: '📅', path: '/my-appointments' },
                  ].map(item => (
                    <button key={item.path} onClick={() => { navigate(item.path); setDropOpen(false) }}
                      className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-primary-light hover:text-primary flex items-center gap-2.5 transition-colors">
                      <span>{item.icon}</span>{item.label}
                    </button>
                  ))}
                  <div className="border-t border-gray-100 mt-1 pt-1">
                    <button onClick={logout}
                      className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 flex items-center gap-2.5 transition-colors">
                      <span>🚪</span> Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button onClick={() => navigate('/login')}
              className="hidden md:flex items-center gap-2 bg-primary hover:bg-primary-dark text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all duration-200 shadow-md hover:shadow-glow">
              Get Started →
            </button>
          )}

          {/* Mobile menu btn */}
          <button onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 rounded-xl hover:bg-gray-100 transition-colors">
            <span className={`block w-5 h-0.5 bg-gray-700 transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-5 h-0.5 bg-gray-700 transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-5 h-0.5 bg-gray-700 transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ${menuOpen ? 'max-h-screen' : 'max-h-0'}`}>
        <div className="px-4 pb-4 pt-2 bg-white border-t border-gray-100 flex flex-col gap-1">
          {navLinks.map(({ to, label }) => (
            <NavLink key={to} to={to}
              className={({ isActive }) =>
                `px-4 py-3 rounded-xl text-sm font-medium ${isActive ? 'bg-primary-light text-primary' : 'text-gray-700 hover:bg-gray-50'}`
              }
            >{label}</NavLink>
          ))}
          {!token && (
            <button onClick={() => navigate('/login')}
              className="mt-2 bg-primary text-white py-3 rounded-xl text-sm font-semibold">
              Get Started
            </button>
          )}
        </div>
      </div>
    </header>
  )
}

export default Navbar
