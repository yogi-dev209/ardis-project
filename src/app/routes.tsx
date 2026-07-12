import { createBrowserRouter, Outlet, useNavigate } from 'react-router';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { DataPegawai } from './pages/DataPegawai';
import { UsulanMusnah } from './pages/UsulanMusnah';
import { Pengajuan } from './pages/Pengajuan';
import { TemporaryStorage } from './pages/TemporaryStorage';
import { PencacahanArsip } from './pages/PencacahanArsip';
import { Pengaturan } from './pages/Pengaturan';
import { RoleManagement } from './pages/RoleManagement';
import { useAuth } from './context/AuthContext';
import { useEffect } from 'react';

function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[#1a2642]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#e8630a] border-solid"></div>
      </div>
    );
  }

  return isAuthenticated ? <Outlet /> : null;
}

function RedirectToHome() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/', { replace: true });
  }, [navigate]);

  return null;
}

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/',
        element: <Layout><Dashboard /></Layout>,
      },
      {
        path: '/pegawai',
        element: <Layout><DataPegawai /></Layout>,
      },
      {
        path: '/usulan-musnah',
        element: <Layout><UsulanMusnah /></Layout>,
      },
      {
        path: '/pengajuan',
        element: <Layout><Pengajuan /></Layout>,
      },
      {
        path: '/tps',
        element: <Layout><TemporaryStorage /></Layout>,
      },
      {
        path: '/pencacahan',
        element: <Layout><PencacahanArsip /></Layout>,
      },
      {
        path: '/pegawai/role',
        element: <Layout><RoleManagement /></Layout>,
      },
      {
        path: '/pengaturan',
        element: <Layout><Pengaturan /></Layout>,
      },
    ],
  },
  {
    path: '*',
    element: <RedirectToHome />,
  },
]);
