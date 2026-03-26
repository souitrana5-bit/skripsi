import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { generateContent } from '../lib/gemini';
import { Loader2, Sparkles, ArrowRight, Download } from 'lucide-react';
import Markdown from 'react-markdown';
import { exportToWord } from '../lib/exportDocx';

export const Revisi = () => {
  const { user, data, updateData } = useAppContext();
  const [teksAsli, setTeksAsli] = useState('');
  const [catatan, setCatatan] = useState('');
  const [hasil, setHasil] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRevisi = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teksAsli || !catatan) return;

    setLoading(true);
    const prompt = `Anda adalah editor akademik profesional. Tolong revisi teks skripsi berikut berdasarkan catatan dosen pembimbing.
    
    Teks Asli:
    "${teksAsli}"
    
    Catatan Dosen:
    "${catatan}"
    
    Berikan hasil revisi yang langsung bisa digunakan, dengan gaya bahasa akademik formal yang baik dan benar. Format menggunakan Markdown.`;

    try {
      const res = await generateContent(prompt, 'formal');
      setHasil(res);
      updateData('revisi', res);
    } catch (error) {
      alert("Terjadi kesalahan saat melakukan revisi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Revisi Otomatis</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Perbaiki paragraf skripsi Anda berdasarkan catatan revisi dari dosen.</p>
        </div>
        <button
          onClick={() => exportToWord(data, user, 'full')}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl transition-colors"
        >
          <Download size={18} />
          Export Full Skripsi
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
          <form onSubmit={handleRevisi} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Teks Asli (Sebelum Revisi)</label>
              <textarea
                required
                value={teksAsli}
                onChange={(e) => setTeksAsli(e.target.value)}
                className="w-full h-48 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                placeholder="Paste paragraf atau bagian skripsi yang perlu direvisi di sini..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Catatan Dosen Pembimbing</label>
              <textarea
                required
                value={catatan}
                onChange={(e) => setCatatan(e.target.value)}
                className="w-full h-24 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                placeholder="Contoh: Tolong perbaiki tata bahasanya, tambahkan referensi teori X, dan buat lebih mengalir."
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 rounded-xl transition-colors disabled:opacity-70"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Sparkles size={20} />}
              {loading ? 'Memproses Revisi...' : 'Mulai Revisi'}
            </button>
          </form>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
            Hasil Revisi <ArrowRight className="text-slate-400" size={18} />
          </h2>
          
          <div className="flex-1 bg-slate-50 dark:bg-slate-900 rounded-xl p-4 border border-slate-100 dark:border-slate-700 overflow-y-auto min-h-[300px]">
            {loading ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4">
                <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
                <p>AI sedang memperbaiki teks Anda...</p>
              </div>
            ) : hasil ? (
              <div className="prose prose-slate max-w-none prose-sm">
                <Markdown>{hasil}</Markdown>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 text-center">
                <p>Hasil revisi akan muncul di sini.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
