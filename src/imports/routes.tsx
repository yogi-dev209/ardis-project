import { createBrowserRouter, Navigate } from 'react-router';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { DataPegawai } from './pages/DataPegawai';
import { UsulanMusnah } from './pages/UsulanMusnah';
import { Pengajuan } from './pages/Pengajuan';
import { TemporaryStorage } from './pages/TemporaryStorage';
import { PencacahanArsip } from './pages/PencacahanArsip';
import { useAuth } from './context/AuthContext';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: <ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>,
  },
  {
    path: '/pegawai',
    element: <ProtectedRoute><Layout><DataPegawai /></Layout></ProtectedRoute>,
  },
  {
    path: '/usulan-musnah',
    element: <ProtectedRoute><Layout><UsulanMusnah /></Layout></ProtectedRoute>,
  },
  {
    path: '/pengajuan',
    element: <ProtectedRoute><Layout><Pengajuan /></Layout></ProtectedRoute>,
  },
  {
    path: '/tps',
    element: <ProtectedRoute><Layout><TemporaryStorage /></Layout></ProtectedRoute>,
  },
  {
    path: '/pencacahan',
    element: <ProtectedRoute><Layout><PencacahanArsip /></Layout></ProtectedRoute>,
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
