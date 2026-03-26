import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { generateContent } from '../lib/gemini';
import { Loader2, Sparkles, Save, Lightbulb, Check, Download } from 'lucide-react';
import Markdown from 'react-markdown';
import { exportToWord } from '../lib/exportDocx';

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
      alert("Terjadi kesalahan saat generate judul.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTitle = () => {
    if (!selectedTitle.trim()) {
      alert("Silakan masukkan judul pilihan Anda terlebih dahulu.");
      return;
    }
    updateData('judul', selectedTitle);
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Generator Judul Skripsi</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Dapatkan inspirasi judul skripsi dan pilih satu judul final untuk dikerjakan.</p>
        </div>
        <button
          onClick={() => exportToWord(data, user, 'full')}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl transition-colors"
        >
          <Download size={18} />
          Export Full Skripsi
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 h-fit">
          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Topik Minat</label>
              <input
                type="text"
                required
                value={topik}
                onChange={(e) => setTopik(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Contoh: Kecerdasan Buatan, Pemasaran Digital"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Metode Penelitian</label>
              <select
                required
                value={metode}
                onChange={(e) => setMetode(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="">Pilih Metode</option>
                <option value="Kualitatif">Kualitatif</option>
                <option value="Kuantitatif">Kuantitatif</option>
                <option value="Campuran (Mixed Methods)">Campuran (Mixed Methods)</option>
                <option value="Research and Development (R&D)">Research and Development (R&D)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Lokasi Penelitian (Opsional)</label>
              <input
                type="text"
                value={lokasi}
                onChange={(e) => setLokasi(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Contoh: PT. ABC, Sekolah XYZ"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Gaya Dosen (Mode AI)</label>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value as any)}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="formal">Formal Akademik (Standar)</option>
                <option value="killer">Dosen Killer (Tanimbar Falaksoru)</option>
                <option value="sederhana">Bahasa Sederhana (Ramah)</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl transition-colors disabled:opacity-70"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Sparkles size={20} />}
              {loading ? 'Generating...' : 'Generate 10 Judul'}
            </button>
          </form>
        </div>

        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Input Judul Final */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
            <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2">Pilih Judul Final Anda</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Ketik atau copy-paste SATU judul yang Anda pilih dari rekomendasi di bawah ini. Judul ini akan digunakan untuk men-generate BAB I - V.</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={selectedTitle}
                onChange={(e) => setSelectedTitle(e.target.value)}
                className="flex-1 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none font-medium text-slate-800 dark:text-slate-100"
                placeholder="Masukkan judul pilihan Anda di sini..."
              />
              <button
                onClick={handleSaveTitle}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
              >
                <Save size={20} />
                Simpan Judul
              </button>
            </div>
            {data.judul === selectedTitle && selectedTitle !== '' && (
              <p className="text-green-600 text-sm mt-3 flex items-center gap-1 font-medium">
                <Check size={16}/> Judul berhasil disimpan! Anda bisa lanjut ke BAB I.
              </p>
            )}
          </div>

          {/* Hasil Rekomendasi */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 min-h-[400px]">
            <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">Rekomendasi 10 Judul</h2>
            
            {loading ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4 py-20">
                <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
                <p>AI sedang memikirkan judul terbaik untuk Anda...</p>
              </div>
            ) : result ? (
              <div className="prose prose-slate max-w-none prose-headings:text-blue-800 prose-a:text-blue-600">
                <Markdown>{result}</Markdown>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 py-20">
                <Lightbulb className="w-12 h-12 mb-4 opacity-20" />
                <p>Belum ada rekomendasi judul.</p>
                <p className="text-sm">Silakan isi form di samping dan klik Generate.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
