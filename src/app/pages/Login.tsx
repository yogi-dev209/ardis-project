import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { User, Lock, Eye, EyeOff, Check } from 'lucide-react';
import { ArdisLogoIcon } from '../components/ArdisLogo';

export function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const success = await login(username, password);
    if (success) {
      navigate('/');
    } else {
      setError('Username atau password salah. Silakan coba lagi.');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Column - 45% */}
      <div className="w-[45%] bg-[#1a2642] flex flex-col items-center justify-between py-16 px-12">
        <div className="flex-1 flex flex-col items-center justify-center max-w-md">
          {/* Logo */}
          <ArdisLogoIcon size={100} />
          <h1 className="text-white text-5xl font-bold mt-8 mb-4 tracking-wide">ARDIS</h1>
          <p className="text-[#7a9ac4] text-base text-center mb-16">
            Archive Records Destruction Information System
          </p>

          {/* Features */}
          <div className="space-y-5 w-full">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-[#e8630a] flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="w-3.5 h-3.5 text-white" />
              </div>
              <p className="text-white text-sm leading-relaxed">
                Deteksi otomatis arsip retensi habis yang siap dimusnahkan
              </p>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-[#e8630a] flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="w-3.5 h-3.5 text-white" />
              </div>
              <p className="text-white text-sm leading-relaxed">
                Integrasi data arsip tersimpan dan arsip usulan musnah dalam satu sistem terpusat
              </p>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-[#e8630a] flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="w-3.5 h-3.5 text-white" />
              </div>
              <p className="text-white text-sm leading-relaxed">
                Laporan real-time dan akurat
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-[#7a9ac4] text-sm">© 2026 ARDIS System — Kearsipan Resmi</p>
      </div>

      {/* Right Column - 55% */}
      <div className="w-[55%] bg-white flex items-center justify-center px-12">
        <div className="w-full max-w-[380px]">
          {/* Logo Small */}
          <div className="mb-6 flex items-center gap-2">
            <ArdisLogoIcon size={32} />
            <span className="text-[#1a2642] font-bold text-base">ARDIS</span>
          </div>

          {/* Title */}
          <h2 className="text-[#1a2642] text-2xl font-bold mb-2">Selamat Datang</h2>
          <p className="text-gray-600 text-sm mb-8">Masuk ke sistem untuk mengakses layanan arsip</p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                USERNAME / NIP
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Masukkan username atau NIP"
                  className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e8630a] focus:border-transparent"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-medium text-gray-700">PASSWORD</label>
                <button
                  type="button"
                  className="text-xs text-[#e8630a] hover:underline"
                >
                  Lupa Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e8630a] focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-3.5 h-3.5 rounded border-gray-300 text-[#e8630a] focus:ring-[#e8630a]"
              />
              <label htmlFor="remember" className="ml-2 text-xs text-gray-700">
                Ingat saya di perangkat ini
              </label>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-2.5">
                <p className="text-red-700 text-xs">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-[#e8630a] text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-[#d15709] transition-colors"
            >
              Masuk ke Sistem
            </button>
          </form>

          {/* Help Text */}
          <p className="text-center text-xs text-gray-600 mt-5">
            Butuh bantuan? Hubungi IT Support: ext. 101
          </p>
        </div>
      </div>
    </div>
  );
}
