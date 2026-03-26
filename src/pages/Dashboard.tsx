import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Link } from 'react-router-dom';
import { FileText, Lightbulb, PenTool, CheckCircle2, Circle, Download } from 'lucide-react';
import { exportToWord } from '../lib/exportDocx';

export const Dashboard = () => {
  const { user, progress, data } = useAppContext();

  const getStatus = () => {
    if (data.bab5) return "Selesai (BAB V)";
    if (data.bab4) return "Mengerjakan BAB V";
    if (data.bab3) return "Mengerjakan BAB IV";
    if (data.bab2) return "Mengerjakan BAB III";
    if (data.bab1) return "Mengerjakan BAB II";
    if (data.judul) return "Mengerjakan BAB I";
    return "Mencari Judul";
  };

  const steps = [
    { id: 'judul', label: 'Judul Skripsi', done: !!data.judul },
    { id: 'bab1', label: 'BAB I', done: !!data.bab1 },
    { id: 'bab2', label: 'BAB II', done: !!data.bab2 },
    { id: 'bab3', label: 'BAB III', done: !!data.bab3 },
    { id: 'bab4', label: 'BAB IV', done: !!data.bab4 },
    { id: 'bab5', label: 'BAB V', done: !!data.bab5 },
  ];

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Selamat datang, {user?.name}!</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Program Studi: {user?.prodi}</p>
        </div>
        <button
          onClick={() => exportToWord(data, user, 'full')}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl transition-colors"
        >
          <Download size={18} />
          Export Full Skripsi
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Progress Card */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">Progress Skripsi</h2>
          <div className="flex items-end gap-4 mb-2">
            <span className="text-4xl font-bold text-blue-600">{Math.round(progress)}%</span>
            <span className="text-slate-500 dark:text-slate-400 mb-1">{getStatus()}</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-3 mb-6">
            <div 
              className="bg-blue-600 h-3 rounded-full transition-all duration-1000" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          <div className="space-y-3">
            {steps.map((step) => (
              <div key={step.id} className="flex items-center gap-3">
                {step.done ? (
                  <CheckCircle2 className="text-green-500 w-5 h-5" />
                ) : (
                  <Circle className="text-slate-300 w-5 h-5" />
                )}
                <span className={step.done ? 'text-slate-800 dark:text-slate-100' : 'text-slate-400'}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Aksi Cepat</h2>
          <Link to="/judul" className="flex items-center gap-4 p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 hover:border-blue-200 hover:shadow-md transition-all group">
            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/50 rounded-xl flex items-center justify-center group-hover:bg-blue-100 dark:group-hover:bg-blue-900/80 transition-colors">
              <Lightbulb className="text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 dark:text-slate-100">Buat Judul</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Cari inspirasi judul skripsi</p>
            </div>
          </Link>
          
          <Link to="/bab/1" className="flex items-center gap-4 p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 hover:border-blue-200 hover:shadow-md transition-all group">
            <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/50 rounded-xl flex items-center justify-center group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/80 transition-colors">
              <FileText className="text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 dark:text-slate-100">Generate BAB</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Lanjutkan penulisan bab</p>
            </div>
          </Link>

          <Link to="/revisi" className="flex items-center gap-4 p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 hover:border-blue-200 hover:shadow-md transition-all group">
            <div className="w-12 h-12 bg-orange-50 dark:bg-orange-900/50 rounded-xl flex items-center justify-center group-hover:bg-orange-100 dark:group-hover:bg-orange-900/80 transition-colors">
              <PenTool className="text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 dark:text-slate-100">Revisi Otomatis</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Perbaiki teks berdasarkan catatan dosen</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};
