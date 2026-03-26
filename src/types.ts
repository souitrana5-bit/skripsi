export interface User {
  name: string;
  nim: string;
  prodi: string;
  fakultas: string;
  universitas: string;
  tahun: string;
}

export interface SkripsiData {
  judul: string;
  rekomendasiJudul: string;
  kataPengantar: string;
  bab1: string;
  bab2: string;
  bab3: string;
  bab4: string;
  bab5: string;
  revisi: string;
}

export interface AppState {
  user: User | null;
  data: SkripsiData;
  progress: number;
}
