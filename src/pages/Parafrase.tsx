import React, { useState } from 'react';
import { generateContent } from '../lib/gemini';
import { Loader2, Sparkles, ArrowRight, Copy, Check, Download, RefreshCw, FileText } from 'lucide-react';
import Markdown from 'react-markdown';
import { exportToWord, exportTextToWord } from '../lib/exportDocx';
import { useAppContext } from '../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';

export const Parafrase = () => {
  const { user, data } = useAppContext();
  const [teksAsli, setTeksAsli] = useState('');
  const [hasil, setHasil] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleParafrase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teksAsli) return;

    setLoading(true);
    const prompt = `Anda adalah editor akademik profesional. Tolong lakukan parafrase (tulis ulang) pada teks berikut agar terhindar dari plagiarisme (turnitin). 
    Gunakan bahasa akademik formal yang lebih baik, pertahankan makna aslinya, dan buat penjelasannya lebih komprehensif dan mendalam.
    
    Teks Asli:
    "${teksAsli}"
    
    Berikan hasil parafrase yang langsung bisa digunakan. Format menggunakan Markdown.`;

    try {
      const res = await generateContent(prompt, 'formal');
      setHasil(res);
    } catch (error) {
      console.error("Error paraphrasing:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(hasil);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
        className="flex flex-col lg:flex-row lg:items-end justify-between gap-8"
      >
        <div className="flex-1">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white font-display tracking-tight">Parafrase Teks</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Tulis ulang paragraf untuk menghindari plagiarisme (Turnitin) dan membuatnya lebih komprehensif.</p>
        </div>
        <button
          onClick={() => exportToWord(data, user, 'full')}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl transition-all shadow-lg shadow-blue-200 dark:shadow-blue-900/20 font-bold active:scale-95 text-sm"
        >
          <Download size={18} />
          Export Full Skripsi
        </button>
      </motion.header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div variants={itemVariants} className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-800">
            <form onSubmit={handleParafrase} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Teks Asli</label>
                <textarea
                  required
                  value={teksAsli}
                  onChange={(e) => setTeksAsli(e.target.value)}
                  className="w-full h-64 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none resize-none transition-all placeholder:text-slate-400"
                  placeholder="Paste paragraf yang ingin diparafrase di sini..."
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-slate-900 dark:bg-slate-800 text-white px-6 py-4 rounded-2xl transition-all disabled:opacity-70 font-bold active:scale-[0.98] shadow-lg shadow-slate-200 dark:shadow-slate-900/20"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
                {loading ? 'Memproses Parafrase...' : 'Mulai Parafrase'}
              </button>
            </form>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col min-h-[500px]">
          <div className="flex items-center justify-between px-8 py-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg flex items-center justify-center">
                <Sparkles size={18} />
              </div>
              <h2 className="font-bold text-slate-900 dark:text-white font-display">Hasil Parafrase</h2>
            </div>
            
            {hasil && !loading && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => exportTextToWord(hasil, "Hasil_Parafrase.docx")}
                  className="flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 bg-white dark:bg-slate-800 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all active:scale-95"
                >
                  <Download size={16} />
                  Word
                </button>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 bg-white dark:bg-slate-800 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all active:scale-95"
                >
                  {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                  {copied ? 'Tersalin' : 'Salin'}
                </button>
              </div>
            )}
          </div>
          
          <div className="p-8 flex-1 overflow-y-auto relative">
            {loading ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 space-y-6 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm z-10">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-blue-100 dark:border-blue-900/30 border-t-blue-600 rounded-full animate-spin" />
                  <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-600" size={24} />
                </div>
                <p className="font-bold animate-pulse">AI sedang memparafrase teks Anda...</p>
              </div>
            ) : hasil ? (
              <div className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-display prose-headings:tracking-tight prose-p:leading-relaxed">
                <Markdown>{hasil}</Markdown>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 py-20 text-center">
                <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
                  <ArrowRight className="opacity-20" size={40} />
                </div>
                <p className="font-bold text-lg">Belum ada hasil parafrase</p>
                <p className="text-sm mt-1">Hasil parafrase akan muncul di sini</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};
