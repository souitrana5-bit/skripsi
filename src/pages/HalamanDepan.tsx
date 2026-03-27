import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { generateContent } from '../lib/gemini';
import { Loader2, Sparkles, Save, Edit3, FileText, Download } from 'lucide-react';
import Markdown from 'react-markdown';
import { exportToWord } from '../lib/exportDocx';
import { motion, AnimatePresence } from 'motion/react';

export const HalamanDepan = () => {
  const { data, user, updateData } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(data.kataPengantar || '');

  const handleGenerate = async () => {
    if (!data.judul) {
      return;
    }

    setLoading(true);
    const prompt = `Buatkan "Kata Pengantar" untuk skripsi dengan judul: "${data.judul}".
    Data Penulis:
    - Nama: ${user?.name}
    - Program Studi: ${user?.prodi}
    - Universitas: ${user?.universitas}
    
    Tuliskan dengan gaya bahasa akademik formal yang baik dan benar. Sertakan ucapan terima kasih kepada Rektor, Dekan, Ketua Program Studi, Dosen Pembimbing, Orang Tua, dan pihak-pihak terkait lainnya. Gunakan format Markdown.`;

    try {
      const res = await generateContent(prompt, 'formal');
      setContent(res);
      updateData('kataPengantar', res);
      setIsEditing(false);
    } catch (error) {
      console.error("Error generating Kata Pengantar:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEdit = () => {
    updateData('kataPengantar', content);
    setIsEditing(false);
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
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white font-display tracking-tight">Halaman Depan</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Generate Kata Pengantar. (Cover, Daftar Isi, Daftar Tabel, dan Daftar Gambar akan otomatis dibuat saat Export Word).</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => exportToWord(data, user, 'full')}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-2xl transition-all shadow-lg shadow-blue-200 dark:shadow-blue-900/20 font-bold active:scale-95 text-sm"
            >
              <Download size={18} />
              Full
            </button>
            <button
              onClick={() => exportToWord(data, user, 'halaman-depan')}
              className="flex items-center justify-center gap-2 bg-slate-900 dark:bg-slate-800 text-white px-5 py-3 rounded-2xl transition-all shadow-sm font-bold active:scale-95 text-sm"
            >
              <Download size={18} />
              Halaman Depan
            </button>
          </div>
          
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl transition-all disabled:opacity-70 shadow-lg shadow-blue-200 dark:shadow-blue-900/20 font-bold active:scale-95 text-sm"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
            Generate Kata Pengantar
          </button>
        </div>
      </motion.header>

      <motion.div 
        variants={itemVariants}
        className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col min-h-[700px] transition-colors"
      >
        <div className="flex items-center justify-between px-8 py-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg flex items-center justify-center">
              <FileText size={18} />
            </div>
            <h2 className="font-bold text-slate-900 dark:text-white font-display">Konten Kata Pengantar</h2>
          </div>
          
          {content && !loading && (
            <button
              onClick={() => isEditing ? handleSaveEdit() : setIsEditing(true)}
              className="flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 bg-white dark:bg-slate-800 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all active:scale-95"
            >
              {isEditing ? (
                <><Save size={16} /> Simpan</>
              ) : (
                <><Edit3 size={16} /> Edit Manual</>
              )}
            </button>
          )}
        </div>
        
        <div className="p-8 flex-1 overflow-y-auto relative">
          {loading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 space-y-6 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm z-10">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-blue-100 dark:border-blue-900/30 border-t-blue-600 rounded-full animate-spin" />
                <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-600" size={24} />
              </div>
              <p className="font-bold animate-pulse">AI sedang menulis Kata Pengantar...</p>
            </div>
          ) : content ? (
            isEditing ? (
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full h-[600px] p-6 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm leading-relaxed transition-all"
                placeholder="Tulis kata pengantar di sini..."
              />
            ) : (
              <div className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-display prose-headings:tracking-tight prose-p:leading-relaxed prose-li:leading-relaxed">
                <Markdown>{content}</Markdown>
              </div>
            )
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 py-32">
              <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
                <FileText className="opacity-20" size={40} />
              </div>
              <p className="font-bold text-lg">Belum ada Kata Pengantar</p>
              <p className="text-sm mt-1">Klik tombol Generate di atas untuk memulai</p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};
