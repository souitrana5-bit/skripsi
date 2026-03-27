import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Link } from 'react-router-dom';
import { FileText, Lightbulb, PenTool, CheckCircle2, Circle, Download, ArrowRight } from 'lucide-react';
import { exportToWord } from '../lib/exportDocx';
import { motion } from 'motion/react';

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
            Selamat datang, <span className="text-blue-600 dark:text-blue-400">{user?.name}</span>!
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">
            Program Studi: {user?.prodi}
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
        {/* Progress Card */}
        <motion.div 
          variants={itemVariants}
          className="lg:col-span-7 bg-white dark:bg-slate-900 p-8 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-800 transition-colors"
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white font-display">Progress Skripsi</h2>
            <div className="px-4 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-xs font-bold uppercase tracking-wider">
              {getStatus()}
            </div>
          </div>
          
          <div className="flex items-center gap-6 mb-8">
            <div className="relative w-24 h-24 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-slate-100 dark:text-slate-800"
                />
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={251.2}
                  strokeDashoffset={251.2 - (251.2 * progress) / 100}
                  className="text-blue-600 dark:text-blue-500 transition-all duration-1000 ease-out"
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute text-2xl font-bold text-slate-900 dark:text-white">
                {Math.round(progress)}%
              </span>
            </div>
            <div className="flex-1">
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                Terus semangat! Anda sudah menyelesaikan sebagian besar tahapan skripsi. Selesaikan bab selanjutnya untuk mencapai 100%.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {steps.map((step) => (
              <div 
                key={step.id} 
                className={`flex items-center gap-3 p-4 rounded-2xl border transition-all ${
                  step.done 
                    ? 'bg-green-50/50 dark:bg-green-900/10 border-green-100 dark:border-green-900/20' 
                    : 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800'
                }`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  step.done ? 'bg-green-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-400'
                }`}>
                  {step.done ? <CheckCircle2 size={14} /> : <Circle size={14} />}
                </div>
                <span className={`text-sm font-semibold ${
                  step.done ? 'text-green-700 dark:text-green-400' : 'text-slate-500 dark:text-slate-400'
                }`}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div 
          variants={itemVariants}
          className="lg:col-span-5 space-y-6"
        >
          <h2 className="text-xl font-bold text-slate-900 dark:text-white font-display px-2">Aksi Cepat</h2>
          
          <div className="space-y-4">
            <Link to="/judul" className="flex items-center gap-5 p-5 bg-white dark:bg-slate-900 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-900/50 hover:shadow-xl hover:shadow-blue-500/5 transition-all group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150" />
              <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                <Lightbulb className="text-blue-600 dark:text-blue-400 group-hover:text-white" size={28} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-slate-900 dark:text-white text-lg">Buat Judul</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Cari inspirasi judul skripsi</p>
              </div>
              <ArrowRight className="text-slate-300 dark:text-slate-700 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" size={20} />
            </Link>
            
            <Link to="/bab/1" className="flex items-center gap-5 p-5 bg-white dark:bg-slate-900 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-900/50 hover:shadow-xl hover:shadow-indigo-500/5 transition-all group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150" />
              <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                <FileText className="text-indigo-600 dark:text-indigo-400 group-hover:text-white" size={28} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-slate-900 dark:text-white text-lg">Generate BAB</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Lanjutkan penulisan bab</p>
              </div>
              <ArrowRight className="text-slate-300 dark:text-slate-700 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" size={20} />
            </Link>

            <Link to="/revisi" className="flex items-center gap-5 p-5 bg-white dark:bg-slate-900 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-800 hover:border-orange-200 dark:hover:border-orange-900/50 hover:shadow-xl hover:shadow-orange-500/5 transition-all group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150" />
              <div className="w-14 h-14 bg-orange-50 dark:bg-orange-900/30 rounded-2xl flex items-center justify-center group-hover:bg-orange-600 group-hover:text-white transition-all duration-300">
                <PenTool className="text-orange-600 dark:text-orange-400 group-hover:text-white" size={28} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-slate-900 dark:text-white text-lg">Revisi Otomatis</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Perbaiki teks berdasarkan catatan dosen</p>
              </div>
              <ArrowRight className="text-slate-300 dark:text-slate-700 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors" size={20} />
            </Link>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};
