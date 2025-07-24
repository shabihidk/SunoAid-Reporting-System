import React, { Fragment, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, Transition } from '@headlessui/react';
import { Bell, User, LogOut, Settings, Plus, Home, X, ChevronDown, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import myLogo from '../assets/images/mylogo.jpg';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle scroll behavior for auto-hide navbar
  useEffect(() => {
    let ticking = false;

    const updateScrollDirection = () => {
      const scrollY = window.scrollY;
      
      if (scrollY > 100) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
      
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateScrollDirection);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Check if current path matches link
  const isActivePath = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const NavLink: React.FC<{ to: string; children: React.ReactNode; className?: string }> = ({ 
    to, 
    children, 
    className = "" 
  }) => {
    const isActive = isActivePath(to);
    const baseClasses = "px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg";
    const activeClasses = isActive 
      ? "text-orange-600 bg-orange-50" 
      : "text-gray-700 hover:text-orange-600 hover:bg-orange-50";
    
    return (
      <Link 
        to={to} 
        className={`${baseClasses} ${activeClasses} ${className}`}
      >
        {children}
      </Link>
    );
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-lg shadow-lg border-b border-orange-100' 
        : 'bg-white/90 backdrop-blur-sm shadow-sm border-b border-gray-100'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center group">
              <span className="text-2xl font-bold text-gray-900">
                Suno<span className="text-orange-600">Aid</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-2">
            {user ? (
              <>
                <NavLink to="/dashboard">
                  <Home className="w-4 h-4 mr-2" />
                  Dashboard
                </NavLink>
                <NavLink to="/report">
                  <Plus className="w-4 h-4 mr-2" />
                  Report Issue
                </NavLink>
                
                {/* Notifications */}
                <button className="p-3 text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all duration-200 relative ml-2">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-2 right-2 block h-2 w-2 rounded-full bg-orange-500 shadow-sm"></span>
                </button>

                {/* User Menu */}
                <Menu as="div" className="relative ml-3">
                  <div>
                    <Menu.Button className="flex items-center text-sm rounded-xl p-2 hover:bg-orange-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2">
                      {user.avatar_url ? (
                        <img className="h-8 w-8 rounded-lg object-cover" src={user.avatar_url} alt="" />
                      ) : (
                        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                          <span className="text-white text-sm font-semibold">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <span className="ml-3 text-gray-700 font-medium hidden md:block">{user.name}</span>
                      <ChevronDown className="ml-2 w-4 h-4 text-gray-500" />
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-200"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-150"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="origin-top-right absolute right-0 mt-2 w-56 rounded-xl shadow-lg bg-white ring-1 ring-orange-100 ring-opacity-20 focus:outline-none border border-gray-100">
                      <div className="py-2">
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="text-sm text-gray-500">Signed in as</p>
                          <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                        </div>
                        <div className="py-1">
                          <Menu.Item>
                            {({ active }) => (
                              <Link
                                to="/profile"
                                className={`${
                                  active ? 'bg-orange-50 text-orange-700' : 'text-gray-700'
                                } flex items-center px-4 py-2 text-sm transition-colors duration-150`}
                              >
                                <User className="w-4 h-4 mr-3" />
                                Profile
                              </Link>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <Link
                                to="/settings"
                                className={`${
                                  active ? 'bg-orange-50 text-orange-700' : 'text-gray-700'
                                } flex items-center px-4 py-2 text-sm transition-colors duration-150`}
                              >
                                <Settings className="w-4 h-4 mr-3" />
                                Settings
                              </Link>
                            )}
                          </Menu.Item>
                        </div>
                        <div className="border-t border-gray-100 py-1">
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                onClick={handleLogout}
                                className={`${
                                  active ? 'bg-red-50 text-red-700' : 'text-gray-700'
                                } flex items-center w-full px-4 py-2 text-sm transition-colors duration-150`}
                              >
                                <LogOut className="w-4 h-4 mr-3" />
                                Sign out
                              </button>
                            )}
                          </Menu.Item>
                        </div>
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </>
            ) : (
              <>
                <NavLink to="/dashboard">Browse Issues</NavLink>
                <NavLink to="/login">Sign In</NavLink>
                <Link
                  to="/register"
                  className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 shadow-md hover:shadow-lg ml-2"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center">
            <Menu as="div" className="relative">
              <Menu.Button 
                className="inline-flex items-center justify-center p-3 rounded-lg text-gray-500 hover:text-orange-600 hover:bg-orange-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <span className="sr-only">Open main menu</span>
                {isMobileMenuOpen ? (
                  <X className="block h-6 w-6" />
                ) : (
                  <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </Menu.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-150"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="origin-top-right absolute right-0 mt-2 w-72 rounded-xl shadow-xl bg-white ring-1 ring-orange-100 ring-opacity-20 focus:outline-none border border-gray-100">
                  <div className="py-3">
                    {user ? (
                      <>
                        <div className="px-4 py-3 border-b border-gray-100">
                          <div className="flex items-center">
                            {user.avatar_url ? (
                              <img className="h-10 w-10 rounded-lg object-cover" src={user.avatar_url} alt="" />
                            ) : (
                              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                                <span className="text-white text-sm font-semibold">
                                  {user.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            )}
                            <div className="ml-3">
                              <p className="text-sm font-medium text-gray-900">{user.name}</p>
                              <p className="text-xs text-gray-500">Signed in</p>
                            </div>
                          </div>
                        </div>
                        <div className="py-2">
                          <Menu.Item>
                            {({ active }) => (
                              <Link
                                to="/dashboard"
                                className={`${active ? 'bg-orange-50 text-orange-700' : 'text-gray-700'} flex items-center px-4 py-3 text-sm font-medium transition-colors duration-150`}
                              >
                                <Home className="w-5 h-5 mr-3" />
                                Dashboard
                              </Link>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <Link
                                to="/report"
                                className={`${active ? 'bg-orange-50 text-orange-700' : 'text-gray-700'} flex items-center px-4 py-3 text-sm font-medium transition-colors duration-150`}
                              >
                                <Plus className="w-5 h-5 mr-3" />
                                Report Issue
                              </Link>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <Link
                                to="/profile"
                                className={`${active ? 'bg-orange-50 text-orange-700' : 'text-gray-700'} flex items-center px-4 py-3 text-sm font-medium transition-colors duration-150`}
                              >
                                <User className="w-5 h-5 mr-3" />
                                Profile
                              </Link>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <Link
                                to="/settings"
                                className={`${active ? 'bg-orange-50 text-orange-700' : 'text-gray-700'} flex items-center px-4 py-3 text-sm font-medium transition-colors duration-150`}
                              >
                                <Settings className="w-5 h-5 mr-3" />
                                Settings
                              </Link>
                            )}
                          </Menu.Item>
                        </div>
                        <div className="border-t border-gray-100 py-2">
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                onClick={handleLogout}
                                className={`${active ? 'bg-red-50 text-red-700' : 'text-gray-700'} flex items-center w-full px-4 py-3 text-sm font-medium transition-colors duration-150`}
                              >
                                <LogOut className="w-5 h-5 mr-3" />
                                Sign out
                              </button>
                            )}
                          </Menu.Item>
                        </div>
                      </>
                    ) : (
                      <>
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              to="/dashboard"
                              className={`${active ? 'bg-orange-50 text-orange-700' : 'text-gray-700'} flex items-center px-4 py-3 text-sm font-medium transition-colors duration-150`}
                            >
                              <Home className="w-5 h-5 mr-3" />
                              Browse Issues
                            </Link>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              to="/login"
                              className={`${active ? 'bg-orange-50 text-orange-700' : 'text-gray-700'} flex items-center px-4 py-3 text-sm font-medium transition-colors duration-150`}
                            >
                              <User className="w-5 h-5 mr-3" />
                              Sign In
                            </Link>
                          )}
                        </Menu.Item>
                        <div className="px-4 py-3 border-t border-gray-100">
                          <Link
                            to="/register"
                            className="w-full bg-orange-600 hover:bg-orange-700 text-white px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center"
                          >
                            Get Started
                            <ArrowRight className="ml-2 w-4 h-4" />
                          </Link>
                        </div>
                      </>
                    )}
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
