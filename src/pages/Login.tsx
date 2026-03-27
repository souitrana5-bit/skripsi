import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2, Mail, Lock, User, GraduationCap, School, MapPin, Calendar, ArrowRight } from 'lucide-react';

export const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [nim, setNim] = useState('');
  const [prodi, setProdi] = useState('');
  const [fakultas, setFakultas] = useState('');
  const [universitas, setUniversitas] = useState('');
  const [tahun, setTahun] = useState(new Date().getFullYear().toString());
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { setUser } = useAppContext();
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      if (isLogin) {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
        
        if (userDoc.exists()) {
          setUser(userDoc.data() as any);
          navigate('/');
        } else {
          setError('Data profil tidak ditemukan.');
        }
      } else {
        if (!name || !nim || !prodi || !fakultas || !universitas || !tahun) {
          setError('Mohon lengkapi semua data profil.');
          setLoading(false);
          return;
        }
        
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const userData = { name, nim, prodi, fakultas, universitas, tahun, email };
        
        await setDoc(doc(db, 'users', userCredential.user.uid), userData);
        setUser(userData as any);
        navigate('/');
      }
    } catch (err: any) {
      if (err.code === 'auth/invalid-credential') {
        setError('Email atau password salah. Jika Anda belum punya akun, silakan klik "Daftar di sini" di bawah.');
      } else if (err.code === 'auth/email-already-in-use') {
        setError('Email ini sudah terdaftar. Silakan gunakan email lain atau langsung Masuk.');
      } else {
        setError(err.message || 'Terjadi kesalahan saat autentikasi.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6 py-20 transition-colors duration-300">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl w-full"
      >
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl shadow-slate-200 dark:shadow-black/40 overflow-hidden border border-slate-100 dark:border-slate-800">
          <div className="p-8 md:p-12">
            <div className="flex flex-col items-center mb-10">
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="w-28 h-28 mb-6 relative"
              >
                <div className="absolute inset-0 bg-blue-500/10 dark:bg-blue-500/20 rounded-full blur-2xl animate-pulse" />
                <img 
                  src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiG-GQdZMnVP1ctdgl6T2Uy4wCUtlCpLPYPmF4mTOJXegeF-UC5Cd7boc3mFJznL9ovArYFG2AtcfSsWE9_pknUQHlSx5cDvDLhQ8cyxt_WYtH0zszOXbqBYS3INXqawrwn1wayvK0JU161q5IvSC3E5Z2VA9rBRNYdY-bJubjy3Gh0rK2MQTysrTws2Y4R/s320/Untitled%20design%20(6).png" 
                  alt="SkripsiAI Logo" 
                  className="w-full h-full object-contain relative z-10" 
                  referrerPolicy="no-referrer" 
                />
              </motion.div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white font-display tracking-tight">SkripsiAI</h1>
              <p className="text-slate-500 dark:text-slate-400 text-center mt-2 font-medium">Generator Skripsi Komprehensif (60-70 Halaman)</p>
            </div>

            <AnimatePresence mode="wait">
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 rounded-2xl text-sm font-bold flex items-center gap-3"
                >
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse shrink-0" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleAuth} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Email</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                    <input 
                      type="email" 
                      required 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-400" 
                      placeholder="email@contoh.com" 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Password</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                    <input 
                      type="password" 
                      required 
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)} 
                      className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-400" 
                      placeholder="••••••••" 
                    />
                  </div>
                </div>
              </div>

              <AnimatePresence>
                {!isLogin && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-6 pt-4 border-t border-slate-100 dark:border-slate-800"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Nama Lengkap</label>
                        <div className="relative group">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                          <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-400" placeholder="Nama Anda" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">NIM / NPM</label>
                        <div className="relative group">
                          <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                          <input type="text" required value={nim} onChange={(e) => setNim(e.target.value)} className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-400" placeholder="NIM Anda" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Program Studi</label>
                        <div className="relative group">
                          <School className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                          <input type="text" required value={prodi} onChange={(e) => setProdi(e.target.value)} className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-400" placeholder="Teknik Informatika" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Fakultas</label>
                        <div className="relative group">
                          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                          <input type="text" required value={fakultas} onChange={(e) => setFakultas(e.target.value)} className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-400" placeholder="Ilmu Komputer" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Universitas</label>
                        <div className="relative group">
                          <School className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                          <input type="text" required value={universitas} onChange={(e) => setUniversitas(e.target.value)} className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-400" placeholder="Universitas Indonesia" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Tahun Lulus</label>
                        <div className="relative group">
                          <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                          <input type="text" required value={tahun} onChange={(e) => setTahun(e.target.value)} className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-400" placeholder="2024" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <button 
                type="submit" 
                disabled={loading} 
                className="w-full bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-700 text-white font-bold py-5 rounded-[1.5rem] transition-all mt-8 disabled:opacity-50 active:scale-[0.98] shadow-xl shadow-slate-200 dark:shadow-blue-900/20 flex items-center justify-center gap-3"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : <ArrowRight size={20} />}
                {loading ? 'Memproses...' : (isLogin ? 'Masuk ke Dashboard' : 'Buat Akun Sekarang')}
              </button>
            </form>

            <div className="mt-10 text-center">
              <button 
                onClick={() => setIsLogin(!isLogin)} 
                className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm font-bold transition-colors"
              >
                {isLogin ? (
                  <>Belum punya akun? <span className="text-blue-600 dark:text-blue-400">Daftar di sini</span></>
                ) : (
                  <>Sudah punya akun? <span className="text-blue-600 dark:text-blue-400">Masuk di sini</span></>
                )}
              </button>
            </div>
          </div>
        </div>
        
        <p className="text-center text-slate-400 dark:text-slate-600 text-xs mt-8 font-medium">
          &copy; {new Date().getFullYear()} SkripsiAI. All rights reserved.
        </p>
      </motion.div>
    </div>
  );
};
