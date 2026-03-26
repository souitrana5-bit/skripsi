import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { BookOpen } from 'lucide-react';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4 py-12 transition-colors duration-200">
      <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 transition-colors duration-200">
        <div className="flex flex-col items-center mb-8">
          <div className="w-24 h-24 mb-4">
            <img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiG-GQdZMnVP1ctdgl6T2Uy4wCUtlCpLPYPmF4mTOJXegeF-UC5Cd7boc3mFJznL9ovArYFG2AtcfSsWE9_pknUQHlSx5cDvDLhQ8cyxt_WYtH0zszOXbqBYS3INXqawrwn1wayvK0JU161q5IvSC3E5Z2VA9rBRNYdY-bJubjy3Gh0rK2MQTysrTws2Y4R/s320/Untitled%20design%20(6).png" alt="SkripsiAI Logo" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">SkripsiAI</h1>
          <p className="text-slate-500 dark:text-slate-400 text-center mt-2">Generator Skripsi Komprehensif (60-70 Halaman)</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-xl text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors" placeholder="Masukkan email Anda" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Password</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors" placeholder="Masukkan password Anda" />
          </div>

          {!isLogin && (
            <>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nama Lengkap</label>
                <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors" placeholder="Masukkan nama Anda" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">NIM / NPM</label>
                <input type="text" required value={nim} onChange={(e) => setNim(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors" placeholder="Masukkan NIM Anda" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Program Studi</label>
                <input type="text" required value={prodi} onChange={(e) => setProdi(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors" placeholder="Contoh: Teknik Informatika" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Fakultas</label>
                <input type="text" required value={fakultas} onChange={(e) => setFakultas(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors" placeholder="Contoh: Ilmu Komputer" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Universitas</label>
                <input type="text" required value={universitas} onChange={(e) => setUniversitas(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors" placeholder="Contoh: Universitas Indonesia" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tahun Lulus</label>
                <input type="text" required value={tahun} onChange={(e) => setTahun(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors" placeholder="Contoh: 2024" />
              </div>
            </>
          )}

          <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl transition-colors mt-4 disabled:opacity-50">
            {loading ? 'Memproses...' : (isLogin ? 'Masuk' : 'Daftar')}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button onClick={() => setIsLogin(!isLogin)} className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium">
            {isLogin ? 'Belum punya akun? Daftar di sini' : 'Sudah punya akun? Masuk di sini'}
          </button>
        </div>
      </div>
    </div>
  );
};
