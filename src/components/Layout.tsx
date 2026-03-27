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
  Sun,
  MoreHorizontal
} from 'lucide-react';
import { exportToWord } from '../lib/exportDocx';
import { auth } from '../firebase';
import { motion, AnimatePresence } from 'motion/react';

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
    <div className="flex items-center gap-2.5">
      <div className="p-1.5 bg-blue-600 rounded-lg shadow-sm">
        <img 
          src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiG-GQdZMnVP1ctdgl6T2Uy4wCUtlCpLPYPmF4mTOJXegeF-UC5Cd7boc3mFJznL9ovArYFG2AtcfSsWE9_pknUQHlSx5cDvDLhQ8cyxt_WYtH0zszOXbqBYS3INXqawrwn1wayvK0JU161q5IvSC3E5Z2VA9rBRNYdY-bJubjy3Gh0rK2MQTysrTws2Y4R/s320/Untitled%20design%20(6).png" 
          alt="SkripsiAI Logo" 
          className="w-6 h-6 object-contain invert brightness-0" 
          referrerPolicy="no-referrer" 
        />
      </div>
      <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white font-display">
        Skripsi<span className="text-blue-600 dark:text-blue-400">AI</span>
      </h1>
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 transition-colors duration-300 overflow-hidden">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-300">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <Logo />
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto scrollbar-hide">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 group ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-200 dark:shadow-blue-900/20 font-medium' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200'
                }`
              }
            >
              <span className="transition-transform group-hover:scale-110">{item.icon}</span>
              <span className="text-sm">{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="w-full flex items-center justify-between px-4 py-2.5 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
          >
            <div className="flex items-center gap-3">
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
              <span className="text-sm font-medium">{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
            </div>
          </button>

          <div ref={exportMenuRef} className="relative">
            <button 
              onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
              className="w-full flex items-center justify-between px-4 py-2.5 bg-slate-900 dark:bg-slate-800 text-white rounded-xl hover:bg-slate-800 dark:hover:bg-slate-700 transition-all shadow-sm"
            >
              <div className="flex items-center gap-2">
                <Download size={18} />
                <span className="text-sm font-medium">Export Word</span>
              </div>
              <ChevronDown size={16} className={`transition-transform duration-300 ${isExportMenuOpen ? 'rotate-180' : ''}`} />
            </button>
            
            <AnimatePresence>
              {isExportMenuOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute bottom-full left-0 w-full mb-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl overflow-hidden z-50"
                >
                  {exportOptions.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => handleExport(opt.id)}
                      className="w-full text-left px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-700 hover:text-blue-700 dark:hover:text-blue-400 transition-colors"
                    >
                      {opt.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"
          >
            <LogOut size={18} />
            <span className="text-sm font-medium">Keluar</span>
          </button>
        </div>
      </aside>

      {/* Mobile Top Header */}
      <header className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 z-40 flex items-center justify-between px-5 transition-colors duration-300">
        <Logo />
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-18 bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 z-40 flex items-center justify-around px-4 pb-safe transition-colors duration-300">
        <NavLink to="/" className={({ isActive }) => `flex flex-col items-center justify-center flex-1 h-full transition-all ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600'}`}>
          <div className={`p-1.5 rounded-lg transition-all ${location.pathname === '/' ? 'bg-blue-50 dark:bg-blue-900/30' : ''}`}>
            <LayoutDashboard size={22} />
          </div>
          <span className="text-[10px] mt-1 font-semibold tracking-wide uppercase">Home</span>
        </NavLink>
        <NavLink to="/judul" className={({ isActive }) => `flex flex-col items-center justify-center flex-1 h-full transition-all ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600'}`}>
          <div className={`p-1.5 rounded-lg transition-all ${location.pathname === '/judul' ? 'bg-blue-50 dark:bg-blue-900/30' : ''}`}>
            <Lightbulb size={22} />
          </div>
          <span className="text-[10px] mt-1 font-semibold tracking-wide uppercase">Judul</span>
        </NavLink>
        <NavLink to="/bab/1" className={({ isActive }) => `flex flex-col items-center justify-center flex-1 h-full transition-all ${location.pathname.startsWith('/bab') ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600'}`}>
          <div className={`p-1.5 rounded-lg transition-all ${location.pathname.startsWith('/bab') ? 'bg-blue-50 dark:bg-blue-900/30' : ''}`}>
            <BookOpen size={22} />
          </div>
          <span className="text-[10px] mt-1 font-semibold tracking-wide uppercase">Bab</span>
        </NavLink>
        <button 
          onClick={() => setIsMobileMenuOpen(true)} 
          className="flex flex-col items-center justify-center flex-1 h-full text-slate-400 dark:text-slate-500 hover:text-slate-600"
        >
          <div className="p-1.5 rounded-lg">
            <MoreHorizontal size={22} />
          </div>
          <span className="text-[10px] mt-1 font-semibold tracking-wide uppercase">More</span>
        </button>
      </nav>

      {/* Mobile Full Screen Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="md:hidden fixed inset-0 bg-white dark:bg-slate-950 z-50 flex flex-col transition-colors duration-300"
          >
            <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white font-display">Menu Lengkap</h2>
              <button 
                onClick={() => setIsMobileMenuOpen(false)} 
                className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all"
              >
                <X size={24} />
              </button>
            </div>
            <nav className="flex-1 p-6 space-y-2 overflow-y-auto pb-32">
              <div className="grid grid-cols-1 gap-2">
                {navItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-4 px-5 py-4 rounded-2xl transition-all ${
                        isActive 
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 dark:shadow-blue-900/20' 
                          : 'bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400'
                      }`
                    }
                  >
                    <div className="p-2 bg-white/10 rounded-lg">{item.icon}</div>
                    <span className="font-medium">{item.label}</span>
                  </NavLink>
                ))}
              </div>
              
              <div className="pt-8 mt-6 border-t border-slate-100 dark:border-slate-800">
                <div className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4 px-2">Export Dokumen</div>
                <div className="grid grid-cols-2 gap-3">
                  {exportOptions.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => handleExport(opt.id)}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-semibold hover:bg-slate-200 dark:hover:bg-slate-800 transition-all border border-transparent active:scale-95"
                    >
                      <Download size={16} className="text-blue-600 dark:text-blue-400" />
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-8 mt-6 border-t border-slate-100 dark:border-slate-800">
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 rounded-2xl font-bold transition-all active:scale-95"
                >
                  <LogOut size={20} />
                  Keluar dari Akun
                </button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pt-16 pb-20 md:pt-0 md:pb-0 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
        <div className="max-w-5xl mx-auto p-5 md:p-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
