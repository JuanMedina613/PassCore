'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [message, setMessage] = useState('');

  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage('Error: Las contraseñas no coinciden.');
      return;
    }

    setMessage('Registrando...');

    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      setMessage(`Error: ${error.message}`);
      return;
    }

    // Guardar nombre y apellido en la tabla perfiles
    const userId = data.user?.id;
    if (userId) {
      const { error: perfilError } = await supabase
        .from('perfiles')
        .insert({ id: userId, email, nombre, apellido });

      if (perfilError) {
        setMessage(`Error al guardar perfil: ${perfilError.message}`);
        return;
      }
    }

    setMessage('¡Registro exitoso! Redirigiendo...');
    router.push('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 font-sans p-4">
      <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md border border-gray-200">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-blue-800 mb-2">Crear Cuenta</h1>
          <p className="text-gray-600 font-medium">Únete a PassCore</p>
        </div>

        <form onSubmit={handleSignUp} className="flex flex-col gap-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-bold text-gray-800 mb-2">Nombre</label>
              <input
                type="text"
                placeholder="Juan"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-700 transition-all text-gray-900"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-bold text-gray-800 mb-2">Apellido</label>
              <input
                type="text"
                placeholder="García"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-700 transition-all text-gray-900"
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2">Correo Electrónico</label>
            <input
              type="email"
              placeholder="tu@email.com"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-700 transition-all text-gray-900"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2">Contraseña</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-700 transition-all text-gray-900"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2">Confirmar Contraseña</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-700 transition-all text-gray-900"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="w-full bg-blue-700 text-white font-bold py-3 rounded-xl hover:bg-blue-800 transition-colors shadow-md mt-2">
            Registrarse
          </button>
        </form>

        <div className="mt-8 text-center">
          <Link href="/login" className="text-sm text-gray-600 hover:text-blue-800 font-medium transition-colors">
            ← Volver al login
          </Link>
        </div>

        {message && (
          <p className={`mt-4 text-sm text-center font-bold ${message.startsWith('Error') ? 'text-red-600' : 'text-blue-800'}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}