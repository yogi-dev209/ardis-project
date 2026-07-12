import { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  username: string;
  nama: string;
  jabatan: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const validUsers = [
  { username: 'dedy_arsiparis', password: 'Arsipar!s2026', nama: 'Dedy Dwi A', jabatan: 'SPr II Kearsipan' },
  { username: 'ari_arsiparis', password: 'Arsipar!s2026', nama: 'Ari Riski H', jabatan: 'PI. Kearsipan' },
  { username: 'donny_arsiparis', password: 'Arsipar!s2026', nama: 'Donny Ariesta P', jabatan: 'Staf Kearsipan' },
  { username: 'agung_arsiparis', password: 'Arsipar!s2026', nama: 'Agung', jabatan: 'Staf Kearsipan' },
  { username: 'imam_arsiparis', password: 'Arsipar!s2026', nama: 'Moch. Imam L', jabatan: 'Staf Kearsipan' },
  { username: 'dela_arsiparis', password: 'Arsipar!s2026', nama: 'Dela Mili A', jabatan: 'Staf Kearsipan' },
  { username: 'admin_arsiparis', password: 'Arsipar!s2026', nama: 'Admin Arsiparis', jabatan: 'Super Administrator' },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (username: string, password: string): boolean => {
    const validUser = validUsers.find(u => u.username === username && u.password === password);
    if (validUser) {
      setUser({ username: validUser.username, nama: validUser.nama, jabatan: validUser.jabatan });
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
