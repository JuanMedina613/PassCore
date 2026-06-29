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
    <div className="min-h-screen flex items-center justify-center p-4 font-sans" style={{ background: "#0F172A" }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black mb-1" style={{ color: "#6366F1" }}>PassCore</h1>
          <p className="text-sm font-medium" style={{ color: "#94A3B8" }}>Creá tu cuenta gratis</p>
        </div>

        <div className="rounded-3xl border p-8" style={{ background: "#1E293B", borderColor: "#334155" }}>
          <form onSubmit={handleSignUp} className="flex flex-col gap-5">
            <div className="flex gap-4">
              {[
                { label: "Nombre", value: nombre, setter: setNombre, placeholder: "Juan" },
                { label: "Apellido", value: apellido, setter: setApellido, placeholder: "García" },
              ].map(({ label, value, setter, placeholder }) => (
                <div key={label} className="flex-1">
                  <label className="block text-xs font-bold mb-2 uppercase tracking-wider" style={{ color: "#94A3B8" }}>{label}</label>
                  <input
                    type="text"
                    placeholder={placeholder}
                    className="w-full px-4 py-3 rounded-xl border outline-none text-sm font-medium transition-all"
                    style={{ background: "#0F172A", borderColor: "#334155", color: "#F8FAFC" }}
                    value={value}
                    onChange={(e) => setter(e.target.value)}
                    onFocus={e => (e.currentTarget.style.borderColor = "#6366F1")}
                    onBlur={e => (e.currentTarget.style.borderColor = "#334155")}
                    required
                  />
                </div>
              ))}
            </div>

            {[
              { label: "Correo Electrónico", value: email, setter: setEmail, placeholder: "tu@email.com", type: "email" },
              { label: "Contraseña", value: password, setter: setPassword, placeholder: "••••••••", type: "password" },
              { label: "Confirmar Contraseña", value: confirmPassword, setter: setConfirmPassword, placeholder: "••••••••", type: "password" },
            ].map(({ label, value, setter, placeholder, type }) => (
              <div key={label}>
                <label className="block text-xs font-bold mb-2 uppercase tracking-wider" style={{ color: "#94A3B8" }}>{label}</label>
                <input
                  type={type}
                  placeholder={placeholder}
                  className="w-full px-4 py-3 rounded-xl border outline-none text-sm font-medium transition-all"
                  style={{ background: "#0F172A", borderColor: "#334155", color: "#F8FAFC" }}
                  value={value}
                  onChange={(e) => setter(e.target.value)}
                  onFocus={e => (e.currentTarget.style.borderColor = "#6366F1")}
                  onBlur={e => (e.currentTarget.style.borderColor = "#334155")}
                  required
                />
              </div>
            ))}

            <button
              type="submit"
              className="w-full font-bold py-3 rounded-xl transition-all mt-2 text-sm"
              style={{ background: "#6366F1", color: "#F8FAFC" }}
              onMouseEnter={e => (e.currentTarget.style.background = "#4F46E5")}
              onMouseLeave={e => (e.currentTarget.style.background = "#6366F1")}
            >
              Registrarse
            </button>
          </form>

          {message && (
            <p
              className="mt-4 text-xs font-bold text-center px-4 py-3 rounded-xl"
              style={
                message.startsWith('Error')
                  ? { background: "#F472B620", color: "#F472B6", border: "1px solid #F472B640" }
                  : { background: "#6366F120", color: "#6366F1", border: "1px solid #6366F140" }
              }
            >
              {message}
            </p>
          )}

          <div className="mt-6 text-center">
            <Link href="/login" className="text-xs font-medium" style={{ color: "#94A3B8" }}>
              ← Volver al login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}