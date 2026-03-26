/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useAppContext } from './context/AppContext';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { GeneratorJudul } from './pages/GeneratorJudul';
import { GeneratorBab } from './pages/GeneratorBab';
import { Revisi } from './pages/Revisi';
import { Parafrase } from './pages/Parafrase';
import { HalamanDepan } from './pages/HalamanDepan';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAppContext();
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="judul" element={<GeneratorJudul />} />
        <Route path="halaman-depan" element={<HalamanDepan />} />
        <Route path="bab/:id" element={<GeneratorBab />} />
        <Route path="revisi" element={<Revisi />} />
        <Route path="parafrase" element={<Parafrase />} />
      </Route>
    </Routes>
  );
};

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppProvider>
  );
}
