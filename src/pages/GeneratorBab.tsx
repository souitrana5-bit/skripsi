import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { generateContent } from '../lib/gemini';
import { Loader2, Sparkles, Save, Edit3, BookOpen, Download, AlertCircle } from 'lucide-react';
import Markdown from 'react-markdown';
import { exportToWord } from '../lib/exportDocx';
import { motion, AnimatePresence } from 'motion/react';

const babConfig = {
  '1': {
    title: 'BAB I: Pendahuluan',
    desc: 'Latar belakang, rumusan masalah, tujuan, manfaat, dan sistematika penulisan.',
    prompt: 'Buatkan BAB I (Pendahuluan) untuk skripsi dengan judul: "{judul}". Harus mencakup: 1. Latar Belakang Masalah, 2. Rumusan Masalah, 3. Tujuan Penelitian, 4. Manfaat Penelitian, 5. Sistematika Penulisan. Tuliskan dengan SANGAT KOMPREHENSIF, MENDALAM, DAN PANJANG (targetkan minimal 2000-3000 kata). Gunakan sub-bab yang sangat detail, elaborasi setiap poin dengan teori dan fenomena yang relevan. Gaya bahasa akademik formal yang sangat baik dan terstruktur. Gunakan format Markdown.'
  },
  '2': {
    title: 'BAB II: Tinjauan Pustaka',
    desc: 'Landasan teori, penelitian terdahulu, dan kerangka berpikir.',
    prompt: 'Buatkan BAB II (Tinjauan Pustaka) untuk skripsi dengan judul: "{judul}". Harus mencakup: 1. Landasan Teori (berikan sub-bab teori yang sangat relevan dan mendalam), 2. Penelitian Terdahulu (buatkan minimal 5 contoh fiktif namun realistis beserta tabel perbandingan), 3. Kerangka Berpikir (deskripsikan secara naratif dan detail), 4. Hipotesis (jika relevan). Tuliskan dengan SANGAT KOMPREHENSIF, MENDALAM, DAN PANJANG (targetkan minimal 3000-4000 kata). Elaborasi setiap teori secara ekstensif. Gaya bahasa akademik formal. Gunakan format Markdown.'
  },
  '3': {
    title: 'BAB III: Metodologi Penelitian',
    desc: 'Jenis penelitian, lokasi, populasi/sampel, teknik pengumpulan dan analisis data.',
    prompt: 'Buatkan BAB III (Metodologi Penelitian) untuk skripsi dengan judul: "{judul}". Harus mencakup: 1. Jenis dan Pendekatan Penelitian, 2. Lokasi dan Waktu Penelitian, 3. Populasi dan Sampel (atau Subjek Penelitian), 4. Variabel Penelitian dan Definisi Operasional, 5. Teknik Pengumpulan Data, 6. Uji Validitas dan Reliabilitas, 7. Teknik Analisis Data. Tuliskan dengan SANGAT KOMPREHENSIF, MENDALAM, DAN PANJANG (targetkan minimal 2000-3000 kata). Jelaskan setiap metode beserta alasan pemilihannya secara akademis. Gaya bahasa akademik formal. Gunakan format Markdown.'
  },
  '4': {
    title: 'BAB IV: Hasil dan Pembahasan',
    desc: 'Hasil penelitian, analisis data, dan pembahasan.',
    prompt: 'Buatkan BAB IV (Hasil dan Pembahasan) untuk skripsi dengan judul: "{judul}". Karena ini adalah generator otomatis, buatkan skenario hasil penelitian fiktif namun sangat logis, komprehensif, dan akademis yang menjawab rumusan masalah. Harus mencakup: 1. Gambaran Umum Objek Penelitian, 2. Hasil Penelitian (sajikan data naratif yang sangat detail, seolah-olah ada tabel/grafik), 3. Analisis Data, 4. Pembahasan (kaitkan temuan dengan teori di BAB II secara kritis dan mendalam). Tuliskan dengan SANGAT KOMPREHENSIF, MENDALAM, DAN PANJANG (targetkan minimal 4000-5000 kata). Gunakan format Markdown.'
  },
  '5': {
    title: 'BAB V: Penutup',
    desc: 'Kesimpulan dan saran.',
    prompt: 'Buatkan BAB V (Penutup) untuk skripsi dengan judul: "{judul}". Berdasarkan pembahasan sebelumnya, buatkan: 1. Kesimpulan (menjawab rumusan masalah secara komprehensif namun padat), 2. Saran (akademis dan praktis yang sangat spesifik dan dapat ditindaklanjuti). Tuliskan dengan SANGAT KOMPREHENSIF DAN MENDALAM (targetkan minimal 1000-1500 kata). Gunakan format Markdown.'
  }
};

export const GeneratorBab = () => {
  const { id } = useParams<{ id: string }>();
  const { data, user, updateData } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'formal' | 'killer' | 'sederhana'>('formal');
  const [isEditing, setIsEditing] = useState(false);
  
  const babKey = `bab${id}` as keyof typeof data;
  const [content, setContent] = useState(data[babKey] || '');

  const config = babConfig[id as keyof typeof babConfig];

  useEffect(() => {
    setContent(data[babKey] || '');
    setIsEditing(false);
  }, [id, data, babKey]);

  if (!config) return <div className="p-10 text-center font-bold text-red-500">BAB tidak ditemukan</div>;

  const handleGenerate = async () => {
    if (!data.judul) {
      return;
    }

    setLoading(true);
    const prompt = config.prompt.replace('{judul}', data.judul);

    try {
      const res = await generateContent(prompt, mode);
      setContent(res);
      updateData(babKey, res);
      setIsEditing(false);
    } catch (error) {
      console.error("Error generating BAB:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEdit = () => {
    updateData(babKey, content);
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
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white font-display tracking-tight">{config.title}</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">{config.desc}</p>
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
              onClick={() => exportToWord(data, user, `bab${id}` as any)}
              className="flex items-center justify-center gap-2 bg-slate-900 dark:bg-slate-800 text-white px-5 py-3 rounded-2xl transition-all shadow-sm font-bold active:scale-95 text-sm"
            >
              <Download size={18} />
              Bab {id}
            </button>
          </div>
          
          <div className="flex items-center gap-2">
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value as any)}
              className="px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold text-sm appearance-none"
            >
              <option value="formal">Formal</option>
              <option value="killer">Killer</option>
              <option value="sederhana">Ramah</option>
            </select>
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl transition-all disabled:opacity-70 shadow-lg shadow-blue-200 dark:shadow-blue-900/20 font-bold active:scale-95 text-sm"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
              Generate
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {!data.judul && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-900/30 text-orange-800 dark:text-orange-400 p-5 rounded-2xl flex items-center gap-4"
          >
            <AlertCircle className="shrink-0" size={24} />
            <p className="font-bold text-sm">
              Peringatan: Anda belum menentukan judul skripsi. Hasil generate mungkin kurang spesifik.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        variants={itemVariants}
        className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col min-h-[700px] transition-colors"
      >
        <div className="flex items-center justify-between px-8 py-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg flex items-center justify-center">
              <BookOpen size={18} />
            </div>
            <h2 className="font-bold text-slate-900 dark:text-white font-display">Konten Dokumen</h2>
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
              <p className="font-bold animate-pulse">AI sedang menulis {config.title}...</p>
            </div>
          ) : content ? (
            isEditing ? (
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full h-[600px] p-6 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm leading-relaxed transition-all"
                placeholder="Tulis konten bab di sini..."
              />
            ) : (
              <div className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-display prose-headings:tracking-tight prose-p:leading-relaxed prose-li:leading-relaxed">
                <Markdown>{content}</Markdown>
              </div>
            )
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 py-32">
              <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
                <BookOpen className="opacity-20" size={40} />
              </div>
              <p className="font-bold text-lg">Belum ada konten untuk bab ini</p>
              <p className="text-sm mt-1">Klik tombol Generate di atas untuk memulai</p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};
