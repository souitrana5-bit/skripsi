import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { generateContent } from '../lib/gemini';
import { Loader2, Sparkles, Save, Lightbulb, Check, Download, ArrowRight } from 'lucide-react';
import Markdown from 'react-markdown';
import { exportToWord } from '../lib/exportDocx';
import { motion, AnimatePresence } from 'motion/react';

export const GeneratorJudul = () => {
  const { user, data, updateData } = useAppContext();
  const [topik, setTopik] = useState('');
  const [metode, setMetode] = useState('');
  const [lokasi, setLokasi] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(data.rekomendasiJudul || '');
  const [mode, setMode] = useState<'formal' | 'killer' | 'sederhana'>('formal');
  const [selectedTitle, setSelectedTitle] = useState(data.judul || '');

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const prompt = `Anda adalah dosen pembimbing skripsi profesional. Buatkan 10 judul skripsi formal akademik berdasarkan data berikut:
    - Program Studi: ${user?.prodi}
    - Topik Minat: ${topik}
    - Metode Penelitian: ${metode}
    - Lokasi Penelitian: ${lokasi}
    
    Tambahkan penjelasan singkat (1-2 kalimat) mengapa judul tersebut relevan dan menarik untuk diteliti. Format output menggunakan Markdown.`;

    try {
      const res = await generateContent(prompt, mode);
      setResult(res);
      updateData('rekomendasiJudul', res);
    } catch (error) {
      console.error("Error generating titles:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTitle = () => {
    if (!selectedTitle.trim()) {
      return;
    }
    updateData('judul', selectedTitle);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-10"
    >
      <motion.header 
        variants={itemVariants}
        className="flex flex-col md:flex-row md:items-end justify-between gap-6"
      >
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white font-display tracking-tight">
            Generator <span className="text-blue-600 dark:text-blue-400">Judul Skripsi</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">
            Dapatkan inspirasi judul skripsi dan pilih satu judul final untuk dikerjakan.
          </p>
        </div>
        <button
          onClick={() => exportToWord(data, user, 'full')}
          className="flex items-center justify-center gap-2.5 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl transition-all shadow-lg shadow-blue-200 dark:shadow-blue-900/20 font-bold active:scale-95"
        >
          <Download size={20} />
          Export Full Skripsi
        </button>
      </motion.header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <motion.div 
          variants={itemVariants}
          className="lg:col-span-4 bg-white dark:bg-slate-900 p-8 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-800 h-fit sticky top-24"
        >
          <h2 className="text-xl font-bold text-slate-900 dark:text-white font-display mb-6">Parameter Judul</h2>
          <form onSubmit={handleGenerate} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 px-1">Topik Minat</label>
              <input
                type="text"
                required
                value={topik}
                onChange={(e) => setTopik(e.target.value)}
                className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                placeholder="Contoh: Kecerdasan Buatan"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 px-1">Metode Penelitian</label>
              <select
                required
                value={metode}
                onChange={(e) => setMetode(e.target.value)}
                className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none"
              >
                <option value="">Pilih Metode</option>
                <option value="Kualitatif">Kualitatif</option>
                <option value="Kuantitatif">Kuantitatif</option>
                <option value="Campuran (Mixed Methods)">Campuran (Mixed Methods)</option>
                <option value="Research and Development (R&D)">Research and Development (R&D)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 px-1">Lokasi Penelitian</label>
              <input
                type="text"
                value={lokasi}
                onChange={(e) => setLokasi(e.target.value)}
                className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                placeholder="Contoh: PT. ABC, Sekolah XYZ"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 px-1">Gaya Dosen</label>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value as any)}
                className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none"
              >
                <option value="formal">Formal Akademik (Standar)</option>
                <option value="killer">Dosen Killer (Tanimbar Falaksoru)</option>
                <option value="sederhana">Bahasa Sederhana (Ramah)</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl transition-all disabled:opacity-70 shadow-lg shadow-blue-200 dark:shadow-blue-900/20 active:scale-95"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Sparkles size={20} />}
              {loading ? 'Generating...' : 'Generate 10 Judul'}
            </button>
          </form>
        </motion.div>

        <div className="lg:col-span-8 space-y-8">
          {/* Input Judul Final */}
          <motion.div 
            variants={itemVariants}
            className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-800"
          >
            <h2 className="text-xl font-bold text-slate-900 dark:text-white font-display mb-2">Pilih Judul Final Anda</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Ketik atau copy-paste SATU judul yang Anda pilih dari rekomendasi di bawah ini.</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                value={selectedTitle}
                onChange={(e) => setSelectedTitle(e.target.value)}
                className="flex-1 px-6 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none font-bold transition-all"
                placeholder="Masukkan judul pilihan Anda di sini..."
              />
              <button
                onClick={handleSaveTitle}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 whitespace-nowrap shadow-lg shadow-green-200 dark:shadow-green-900/20 active:scale-95"
              >
                <Save size={20} />
                Simpan Judul
              </button>
            </div>
            <AnimatePresence>
              {data.judul === selectedTitle && selectedTitle !== '' && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-green-600 dark:text-green-400 text-sm mt-4 flex items-center gap-2 font-bold"
                >
                  <Check size={18} className="p-0.5 bg-green-100 dark:bg-green-900/30 rounded-full" /> 
                  Judul berhasil disimpan! Anda bisa lanjut ke BAB I.
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Hasil Rekomendasi */}
          <motion.div 
            variants={itemVariants}
            className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-800 min-h-[500px] relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white font-display">Rekomendasi Judul</h2>
              {result && (
                <div className="p-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
                  <Sparkles size={20} />
                </div>
              )}
            </div>
            
            {loading ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 space-y-6 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm z-10">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-blue-100 dark:border-blue-900/30 border-t-blue-600 rounded-full animate-spin" />
                  <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-600" size={24} />
                </div>
                <p className="font-bold animate-pulse">AI sedang merancang judul terbaik...</p>
              </div>
            ) : result ? (
              <div className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-display prose-headings:tracking-tight prose-p:leading-relaxed prose-li:leading-relaxed">
                <Markdown>{result}</Markdown>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 py-32">
                <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
                  <Lightbulb className="opacity-20" size={40} />
                </div>
                <p className="font-bold text-lg">Belum ada rekomendasi judul</p>
                <p className="text-sm mt-1">Silakan isi form dan klik Generate</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};
