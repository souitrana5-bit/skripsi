import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { generateContent } from '../lib/gemini';
import { Loader2, Sparkles, Save, Edit3, FileText, Download } from 'lucide-react';
import Markdown from 'react-markdown';
import { exportToWord } from '../lib/exportDocx';

export const HalamanDepan = () => {
  const { data, user, updateData } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(data.kataPengantar || '');

  const handleGenerate = async () => {
    if (!data.judul) {
      alert("Silakan tentukan judul skripsi terlebih dahulu di menu Judul Skripsi.");
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
      alert("Terjadi kesalahan saat generate Kata Pengantar.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEdit = () => {
    updateData('kataPengantar', content);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Halaman Depan</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Generate Kata Pengantar. (Cover, Daftar Isi, Daftar Tabel, dan Daftar Gambar akan otomatis dibuat saat Export Word).</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => exportToWord(data, user, 'full')}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl transition-colors"
          >
            <Download size={18} />
            Export Full
          </button>
          <button
            onClick={() => exportToWord(data, user, 'halaman-depan')}
            className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl transition-colors"
          >
            <Download size={18} />
            Export Halaman Depan
          </button>
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl transition-colors disabled:opacity-70"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Sparkles size={18} />}
            Generate Kata Pengantar
          </button>
        </div>
      </header>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden flex flex-col min-h-[600px]">
        <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
          <h2 className="font-semibold text-slate-700 dark:text-slate-300">Konten Kata Pengantar</h2>
          {content && !loading && (
            <button
              onClick={() => isEditing ? handleSaveEdit() : setIsEditing(true)}
              className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 bg-white dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm"
            >
              {isEditing ? (
                <><Save size={16} /> Simpan Perubahan</>
              ) : (
                <><Edit3 size={16} /> Edit Manual</>
              )}
            </button>
          )}
        </div>
        
        <div className="p-6 flex-1 overflow-y-auto">
          {loading ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4 py-20">
              <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
              <p>AI sedang menulis Kata Pengantar untuk Anda...</p>
            </div>
          ) : content ? (
            isEditing ? (
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full h-[500px] p-4 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm"
              />
            ) : (
              <div className="prose prose-slate max-w-none prose-headings:text-blue-800">
                <Markdown>{content}</Markdown>
              </div>
            )
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 py-20">
              <FileText className="w-12 h-12 mb-4 opacity-20" />
              <p>Belum ada Kata Pengantar.</p>
              <p className="text-sm">Klik tombol Generate di atas untuk memulai.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
