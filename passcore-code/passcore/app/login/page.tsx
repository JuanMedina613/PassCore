'use client'; // Necesario para usar hooks en Next.js
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

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      router.push('/dashboard'); // Redirección exitosa
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 font-sans p-4">
      <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md border border-gray-200">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-blue-800 mb-2">PassCore</h1>
          <p className="text-gray-600 font-medium">Inicia sesión en tu bóveda</p>
        </div>

        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

        <form onSubmit={handleLogin} className="flex flex-col gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2">Correo Electrónico</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-700 transition-all text-gray-900" 
              placeholder="tu@email.com" 
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2">Contraseña</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-700 transition-all text-gray-900" 
              placeholder="••••••••" 
              required
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-blue-700 text-white font-bold py-3 rounded-xl hover:bg-blue-800 transition-colors shadow-md mt-2"
          >
            Ingresar
          </button>
        </form>

        <div className="mt-8 text-center">
          <Link href="/" className="text-sm text-gray-600 hover:text-blue-800 font-medium transition-colors">
            ← Volver al inicio
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                ¿No tienes cuenta?{' '}
                <Link href="/signup" className="text-blue-700 font-bold hover:underline">
                  Regístrate aquí
                </Link>
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
    
  );
}