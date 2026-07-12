import { useNavigate } from 'react-router';
import { ShieldOff } from 'lucide-react';

export function AccessDenied() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="bg-white rounded-lg border border-gray-200 p-8 max-w-md text-center">
        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
          <ShieldOff className="w-8 h-8 text-red-600" />
        </div>
        <h1 className="text-[20px] font-bold text-gray-800 mb-2">Akses Ditolak</h1>
        <p className="text-[12px] text-gray-600 mb-6">
          Anda tidak memiliki izin untuk mengakses halaman ini. Hubungi Administrator jika membutuhkan akses.
        </p>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-blue-600 text-white text-[12px] rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Kembali ke Dashboard
        </button>
      </div>
    </div>
  );
}
