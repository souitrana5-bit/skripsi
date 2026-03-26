import React, { useState, useRef, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { 
  LayoutDashboard, 
  Lightbulb, 
  BookOpen, 
  FileText, 
  PenTool, 
  LogOut,
  Menu,
  X,
  Download,
  RefreshCw,
  File,
  ChevronDown,
  Moon,
  Sun
} from 'lucide-react';
import { exportToWord } from '../lib/exportDocx';
import { auth } from '../firebase';

export const Layout = () => {
  const { user, setUser, data } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const exportMenuRef = useRef<HTMLDivElement>(null);

  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' || 
        (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(event.target as Node)) {
        setIsExportMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      setUser(null);
      navigate('/login');
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const navItems = [
    { path: '/', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { path: '/judul', label: 'Judul Skripsi', icon: <Lightbulb size={20} /> },
    { path: '/halaman-depan', label: 'Halaman Depan', icon: <File size={20} /> },
    { path: '/bab/1', label: 'BAB I', icon: <BookOpen size={20} /> },
    { path: '/bab/2', label: 'BAB II', icon: <BookOpen size={20} /> },
    { path: '/bab/3', label: 'BAB III', icon: <BookOpen size={20} /> },
    { path: '/bab/4', label: 'BAB IV', icon: <FileText size={20} /> },
    { path: '/bab/5', label: 'BAB V', icon: <FileText size={20} /> },
    { path: '/revisi', label: 'Revisi', icon: <PenTool size={20} /> },
    { path: '/parafrase', label: 'Parafrase', icon: <RefreshCw size={20} /> },
  ];

  const exportOptions = [
    { id: 'full', label: 'Full Skripsi' },
    { id: 'halaman-depan', label: 'Halaman Depan' },
    { id: 'bab1', label: 'BAB I' },
    { id: 'bab2', label: 'BAB II' },
    { id: 'bab3', label: 'BAB III' },
    { id: 'bab4', label: 'BAB IV' },
    { id: 'bab5', label: 'BAB V' },
    { id: 'lampiran', label: 'Lampiran' },
  ] as const;

  const handleExport = (type: typeof exportOptions[number]['id']) => {
    exportToWord(data, user, type);
    setIsExportMenuOpen(false);
    setIsMobileMenuOpen(false);
  };

  const Logo = () => (
    <div className="flex items-center gap-3">
      <img 
        src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiG-GQdZMnVP1ctdgl6T2Uy4wCUtlCpLPYPmF4mTOJXegeF-UC5Cd7boc3mFJznL9ovArYFG2AtcfSsWE9_pknUQHlSx5cDvDLhQ8cyxt_WYtH0zszOXbqBYS3INXqawrwn1wayvK0JU161q5IvSC3E5Z2VA9rBRNYdY-bJubjy3Gh0rK2MQTysrTws2Y4R/s320/Untitled%20design%20(6).png" 
        alt="SkripsiAI Logo" 
        className="w-8 h-8 object-contain" 
        referrerPolicy="no-referrer" 
      />
      <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
        SkripsiAI
      </h1>
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900 font-sans text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 shadow-sm transition-colors duration-200">
        <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
          <Logo />
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  isActive 
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-medium' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-slate-200'
                }`
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-100 dark:border-slate-700 relative">
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="w-full flex items-center justify-between px-4 py-3 mb-3 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
          >
            <div className="flex items-center gap-3">
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
            </div>
          </button>

          <div ref={exportMenuRef} className="relative">
            <button 
              onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
              className="w-full flex items-center justify-between px-4 py-2 mb-3 bg-slate-900 dark:bg-slate-700 text-white rounded-xl hover:bg-slate-800 dark:hover:bg-slate-600 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Download size={18} />
                <span>Export Word</span>
              </div>
              <ChevronDown size={16} className={`transition-transform ${isExportMenuOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isExportMenuOpen && (
              <div className="absolute bottom-full left-0 w-full mb-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg overflow-hidden z-50">
                {exportOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => handleExport(opt.id)}
                    className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-700 hover:text-blue-700 dark:hover:text-blue-400 transition-colors"
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
          >
            <LogOut size={20} />
            Keluar
          </button>
        </div>
      </aside>

      {/* Mobile Top Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 z-40 flex items-center justify-between px-4 transition-colors duration-200">
        <Logo />
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors"
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 z-40 flex items-center justify-around px-2 pb-1 transition-colors duration-200">
        <NavLink to="/" className={({ isActive }) => `flex flex-col items-center justify-center w-16 h-full ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400'}`}>
          <LayoutDashboard size={20} />
          <span className="text-[10px] mt-1 font-medium">Home</span>
        </NavLink>
        <NavLink to="/judul" className={({ isActive }) => `flex flex-col items-center justify-center w-16 h-full ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400'}`}>
          <Lightbulb size={20} />
          <span className="text-[10px] mt-1 font-medium">Judul</span>
        </NavLink>
        <NavLink to="/bab/1" className={({ isActive }) => `flex flex-col items-center justify-center w-16 h-full ${location.pathname.startsWith('/bab') ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400'}`}>
          <BookOpen size={20} />
          <span className="text-[10px] mt-1 font-medium">Bab</span>
        </NavLink>
        <button onClick={() => setIsMobileMenuOpen(true)} className={`flex flex-col items-center justify-center w-16 h-full ${isMobileMenuOpen ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400'}`}>
          <Menu size={20} />
          <span className="text-[10px] mt-1 font-medium">Menu</span>
        </button>
      </div>

      {/* Mobile Full Screen Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-white dark:bg-slate-800 z-50 flex flex-col transition-colors duration-200 animate-in slide-in-from-bottom-full">
          <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200 dark:border-slate-700">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Menu Lengkap</h2>
            <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full">
              <X size={24} />
            </button>
          </div>
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto pb-24">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                    isActive 
                      ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-medium' 
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-slate-200'
                  }`
                }
              >
                {item.icon}
                {item.label}
              </NavLink>
            ))}
            
            <div className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-700">
              <div className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-3 px-2">Export Options</div>
              <div className="grid grid-cols-2 gap-2">
                {exportOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => handleExport(opt.id)}
                    className="flex items-center justify-center gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm hover:bg-slate-200 dark:hover:bg-slate-600"
                  >
                    <Download size={14} />
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <button 
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 mt-4 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl"
            >
              <LogOut size={20} />
              Keluar
            </button>
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pt-16 pb-16 md:pt-0 md:pb-0 bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
        <div className="max-w-5xl mx-auto p-4 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
