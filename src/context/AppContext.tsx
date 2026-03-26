import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, SkripsiData } from '../types';
import { auth, db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  data: SkripsiData;
  updateData: (key: keyof SkripsiData, value: string) => void;
  progress: number;
}

const defaultData: SkripsiData = {
  judul: '',
  rekomendasiJudul: '',
  kataPengantar: '',
  bab1: '',
  bab2: '',
  bab3: '',
  bab4: '',
  bab5: '',
  revisi: '',
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [data, setData] = useState<SkripsiData>(() => {
    const saved = localStorage.getItem('skripsi_data');
    return saved ? JSON.parse(saved) : defaultData;
  });
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            setUser(userDoc.data() as User);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        setUser(null);
      }
      setIsAuthReady(true);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    localStorage.setItem('skripsi_data', JSON.stringify(data));
  }, [data]);

  const updateData = (key: keyof SkripsiData, value: string) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const progress = Object.values(data).filter((v) => v.length > 0).length * 14.28; // 7 items ~ 14.28% each

  if (!isAuthReady) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white">Memuat...</div>;
  }

  return (
    <AppContext.Provider value={{ user, setUser, data, updateData, progress }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};
