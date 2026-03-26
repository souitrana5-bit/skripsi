import React, { useState } from 'react';
import { generateContent } from '../lib/gemini';
import { Loader2, Sparkles, ArrowRight, Copy, Check, Download } from 'lucide-react';
import Markdown from 'react-markdown';
import { exportToWord, exportTextToWord } from '../lib/exportDocx';
import { useAppContext } from '../context/AppContext';

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
      alert("Terjadi kesalahan saat melakukan parafrase.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(hasil);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Parafrase Teks</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Tulis ulang paragraf untuk menghindari plagiarisme (Turnitin) dan membuatnya lebih komprehensif.</p>
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
          <form onSubmit={handleParafrase} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Teks Asli</label>
              <textarea
                required
                value={teksAsli}
                onChange={(e) => setTeksAsli(e.target.value)}
                className="w-full h-64 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                placeholder="Paste paragraf yang ingin diparafrase di sini..."
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-xl transition-colors disabled:opacity-70"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Sparkles size={20} />}
              {loading ? 'Memproses Parafrase...' : 'Mulai Parafrase'}
            </button>
          </form>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              Hasil Parafrase <ArrowRight className="text-slate-400" size={18} />
            </h2>
            {hasil && !loading && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => exportTextToWord(hasil, "Hasil_Parafrase.docx")}
                  className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-3 py-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                >
                  <Download size={16} />
                  Export Word
                </button>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1.5 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                  {copied ? 'Tersalin!' : 'Salin Teks'}
                </button>
              </div>
            )}
          </div>
          
          <div className="flex-1 bg-slate-50 dark:bg-slate-900 rounded-xl p-4 border border-slate-100 dark:border-slate-700 overflow-y-auto min-h-[300px]">
            {loading ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                <p>AI sedang memparafrase teks Anda...</p>
              </div>
            ) : hasil ? (
              <div className="prose prose-slate max-w-none prose-sm">
                <Markdown>{hasil}</Markdown>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 text-center">
                <p>Hasil parafrase akan muncul di sini.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
