'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/app/components/Card';
import { Button } from '@/app/components/Button';
import { FormInput } from '@/app/components/FormInput';
import { Toast } from '@/app/components/Toast';
import { useToast } from '@/app/hooks/useToast';
import { useAuth } from '@/app/context/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { toast, hideToast, success, error: showError } = useToast();
  const { login, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      showError('Username dan password harus diisi');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const result = await res.json();

      if (res.ok && result.status === 200) {
        success('Login berhasil! Mengalihkan...');
        
        // Update auth context
        if (result.data) {
          login(result.data);
        }

        setTimeout(() => {
          router.push('/');
        }, 1000);
      } else {
        showError(result.error || 'Username atau password salah');
      }
    } catch (err) {
      showError('Terjadi kesalahan. Silakan coba lagi.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#00A69F] via-[#0D9488] to-[#0F766E] flex items-center justify-center p-4">
      {/* Toast Notification */}
      {toast.isOpen && (
        <Toast
          isOpen={toast.isOpen}
          message={toast.message}
          variant={toast.variant}
          onClose={hideToast}
        />
      )}

      <div className="w-full max-w-md">
        {/* Logo/Brand Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl mb-4 shadow-lg">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <p className="text-white/80 text-lg">Sistem Manajemen Penjualan</p>
        </div>

        {/* Login Card */}
        <Card>
          <div className="p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Selamat Datang</h2>
              <p className="text-gray-600">Silakan login untuk melanjutkan</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <FormInput
                label="Username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Masukkan username"
                required
                autoComplete="username"
              />

              <FormInput
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password"
                required
                autoComplete="current-password"
              />

              <Button
                type="submit"
                variant="primary"
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Memproses...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    Login
                  </span>
                )}
              </Button>
            </form>

            {/* Info/Help Text */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-center text-sm text-gray-600">
                Belum punya akses? Hubungi administrator
              </p>
            </div>
          </div>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center text-white/70 text-sm">
          <p>&copy; 2025 Ziyaa Danil M. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
