// React import not needed due to react-jsx transform
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { useTheme } from '../context/ThemeContext';

export function Navigation() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-gray-800 shadow-md border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Nav Links */}
          <div className="flex items-center space-x-8">
            <Link to="/about" className="flex items-center space-x-2" title="Om & kontakt">
              <svg className="w-8 h-8 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              <span className="text-xl font-bold text-gray-900 dark:text-white">WestWallet</span>
            </Link>

            <div className="hidden md:flex space-x-6">
              <Link 
                to="/"
                className={isActive('/') ? 'nav-link-active group relative p-2 rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-primary-100 dark:hover:bg-primary-900 hover:shadow-lg transition-all duration-300' : 'nav-link group relative p-2 rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-primary-100 dark:hover:bg-primary-900 hover:shadow-lg transition-all duration-300'}
                aria-label="Plånböcker"
              >
                <svg className="w-6 h-6 text-primary-600 dark:text-primary-400 group-hover:text-primary-700 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a4 4 0 004 4h6a4 4 0 004-4V7" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 3v4M8 3v4" />
                </svg>
                <span className="absolute left-1/2 -translate-x-1/2 bottom-[-2.5rem] px-2 py-1 rounded bg-gray-900 text-white text-xs opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-2 transition-all duration-300 pointer-events-none whitespace-nowrap shadow-lg">
                  Plånböcker
                </span>
              </Link>
              <Link 
                to="/categories"
                className={isActive('/categories') ? 'nav-link-active group relative p-2 rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-primary-100 dark:hover:bg-primary-900 hover:shadow-lg transition-all duration-300' : 'nav-link group relative p-2 rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-primary-100 dark:hover:bg-primary-900 hover:shadow-lg transition-all duration-300'}
                aria-label="Kategorier & Leverantörer"
              >
                <svg className="w-6 h-6 text-primary-600 dark:text-primary-400 group-hover:text-primary-700 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
                <span className="absolute left-1/2 -translate-x-1/2 bottom-[-2.5rem] px-2 py-1 rounded bg-gray-900 text-white text-xs opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-2 transition-all duration-300 pointer-events-none whitespace-nowrap shadow-lg">
                  Kategorier & Leverantörer
                </span>
              </Link>
              <Link 
                to="/expenses"
                className={isActive('/expenses') ? 'nav-link-active group relative p-2 rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-primary-100 dark:hover:bg-primary-900 hover:shadow-lg transition-all duration-300' : 'nav-link group relative p-2 rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-primary-100 dark:hover:bg-primary-900 hover:shadow-lg transition-all duration-300'}
                aria-label="Ekonomihantering"
              >
                <svg className="w-6 h-6 text-primary-600 dark:text-primary-400 group-hover:text-primary-700 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-6a2 2 0 012-2h2a2 2 0 012 2v6" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="absolute left-1/2 -translate-x-1/2 bottom-[-2.5rem] px-2 py-1 rounded bg-gray-900 text-white text-xs opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-2 transition-all duration-300 pointer-events-none whitespace-nowrap shadow-lg">
                  Ekonomihantering
                </span>
              </Link>
                <Link 
                  to="/agreements"
                  className={isActive('/agreements') ? 'nav-link-active group relative p-2 rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-primary-100 dark:hover:bg-primary-900 hover:shadow-lg transition-all duration-300' : 'nav-link group relative p-2 rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-primary-100 dark:hover:bg-primary-900 hover:shadow-lg transition-all duration-300'}
                  aria-label="Avtal & abonnemang"
                >
                  <svg className="w-6 h-6 text-primary-600 dark:text-primary-400 group-hover:text-primary-700 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a5 5 0 00-10 0v2M5 9h14a2 2 0 012 2v7a2 2 0 01-2 2H5a2 2 0 01-2-2v-7a2 2 0 012-2z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6" />
                  </svg>
                  <span className="absolute left-1/2 -translate-x-1/2 bottom-[-2.5rem] px-2 py-1 rounded bg-gray-900 text-white text-xs opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-2 transition-all duration-300 pointer-events-none whitespace-nowrap shadow-lg">
                    Avtal & abonnemang
                  </span>
                </Link>
            </div>
          </div>

          {/* User Info & Actions */}
          <div className="flex items-center space-x-4">
            <span className="hidden sm:block text-sm text-gray-600 dark:text-gray-300">
              {user?.username}
            </span>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="group relative p-2 rounded-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-primary-100 dark:hover:bg-primary-900 hover:shadow-lg transition-all duration-300"
              aria-label="Växla tema"
              title="Växla tema"
            >
              {theme === 'light' ? (
                <svg className="w-6 h-6 text-primary-600 dark:text-primary-400 group-hover:text-primary-700 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-6 h-6 text-primary-600 dark:text-primary-400 group-hover:text-primary-700 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

            {/* Print */}
            <button
              onClick={() => window.print()}
              className="group relative p-2 rounded-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-primary-100 dark:hover:bg-primary-900 hover:shadow-lg transition-all duration-300"
              aria-label="Skriv ut"
            >
              <svg className="w-6 h-6 text-primary-600 dark:text-primary-400 group-hover:text-primary-700 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 9V2h12v7M6 18H5a2 2 0 01-2-2v-5a2 2 0 012-2h14a2 2 0 012 2v5a2 2 0 01-2 2h-1M6 14h12v8H6v-8z" />
              </svg>
              <span className="absolute left-1/2 -translate-x-1/2 bottom-[-2.5rem] px-2 py-1 rounded bg-gray-900 text-white text-xs opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-2 transition-all duration-300 pointer-events-none whitespace-nowrap shadow-lg">
                Skriv ut
              </span>
            </button>

            <button
              onClick={logout}
              className="btn-secondary text-sm"
            >
              Logga ut
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden pb-3 space-x-4">
          <Link 
            to="/" 
            className={`inline-block ${isActive('/') ? 'nav-link-active' : 'nav-link'}`}
          >
            Plånböcker
          </Link>
          <Link 
            to="/categories" 
            className={`inline-block ${isActive('/categories') ? 'nav-link-active' : 'nav-link'}`}
          >
            Kategorier
          </Link>
          <Link 
            to="/expenses" 
            className={`inline-block ${isActive('/expenses') ? 'nav-link-active' : 'nav-link'}`}
          >
            Ekonomi
          </Link>
        </div>
      </div>
    </nav>
  );
}
