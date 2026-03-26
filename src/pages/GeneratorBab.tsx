import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { generateContent } from '../lib/gemini';
import { Loader2, Sparkles, Save, Edit3, BookOpen, Download } from 'lucide-react';
import Markdown from 'react-markdown';
import { exportToWord } from '../lib/exportDocx';

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

  if (!config) return <div>BAB tidak ditemukan</div>;

  const handleGenerate = async () => {
    if (!data.judul) {
      alert("Silakan tentukan judul skripsi terlebih dahulu di menu Judul Skripsi.");
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
      alert("Terjadi kesalahan saat generate BAB.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEdit = () => {
    updateData(babKey, content);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{config.title}</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">{config.desc}</p>
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
            onClick={() => exportToWord(data, user, `bab${id}` as any)}
            className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl transition-colors"
          >
            <Download size={18} />
            Export Bab {id}
          </button>
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value as any)}
            className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="formal">Formal Akademik</option>
            <option value="killer">Dosen Killer (Tanimbar Falaksoru)</option>
            <option value="sederhana">Bahasa Sederhana</option>
          </select>
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl transition-colors disabled:opacity-70"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Sparkles size={18} />}
            Generate
          </button>
        </div>
      </header>

      {!data.judul && (
        <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-400 p-4 rounded-xl">
          <strong>Peringatan:</strong> Anda belum memiliki judul skripsi. Hasil generate mungkin kurang spesifik.
        </div>
      )}

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden flex flex-col min-h-[600px]">
        <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
          <h2 className="font-semibold text-slate-700 dark:text-slate-300">Konten Dokumen</h2>
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
              <p>AI sedang menulis {config.title} untuk Anda...</p>
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
              <BookOpen className="w-12 h-12 mb-4 opacity-20" />
              <p>Belum ada konten untuk bab ini.</p>
              <p className="text-sm">Klik tombol Generate di atas untuk memulai.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
