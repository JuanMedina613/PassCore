'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 font-sans" style={{ background: "#0F172A" }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black mb-1" style={{ color: "#6366F1" }}>PassCore</h1>
          <p className="text-sm font-medium" style={{ color: "#94A3B8" }}>Iniciá sesión en tu bóveda</p>
        </div>

        <div className="rounded-3xl border p-8" style={{ background: "#1E293B", borderColor: "#334155" }}>
          {error && (
            <p className="text-xs font-bold mb-6 px-4 py-3 rounded-xl" style={{ background: "#F472B620", color: "#F472B6", border: "1px solid #F472B640" }}>
              {error}
            </p>
          )}

          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            <div>
              <label className="block text-xs font-bold mb-2 uppercase tracking-wider" style={{ color: "#94A3B8" }}>
                Correo Electrónico
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="w-full px-4 py-3 rounded-xl border outline-none text-sm font-medium transition-all"
                style={{ background: "#0F172A", borderColor: "#334155", color: "#F8FAFC" }}
                onFocus={e => (e.currentTarget.style.borderColor = "#6366F1")}
                onBlur={e => (e.currentTarget.style.borderColor = "#334155")}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold mb-2 uppercase tracking-wider" style={{ color: "#94A3B8" }}>
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border outline-none text-sm font-medium transition-all"
                style={{ background: "#0F172A", borderColor: "#334155", color: "#F8FAFC" }}
                onFocus={e => (e.currentTarget.style.borderColor = "#6366F1")}
                onBlur={e => (e.currentTarget.style.borderColor = "#334155")}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full font-bold py-3 rounded-xl transition-all mt-2 text-sm"
              style={{ background: "#6366F1", color: "#F8FAFC" }}
              onMouseEnter={e => (e.currentTarget.style.background = "#4F46E5")}
              onMouseLeave={e => (e.currentTarget.style.background = "#6366F1")}
            >
              Ingresar
            </button>
          </form>

          <div className="mt-6 flex flex-col gap-2 text-center">
            <p className="text-xs" style={{ color: "#94A3B8" }}>
              ¿No tenés cuenta?{" "}
              <Link href="/signup" className="font-bold" style={{ color: "#6366F1" }}>
                Registrate acá
              </Link>
            </p>
            <Link href="/" className="text-xs font-medium" style={{ color: "#94A3B8" }}>
              ← Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}