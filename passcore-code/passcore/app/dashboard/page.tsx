"use client";

import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

interface Credencial {
  id: string;
  sitio: string;
  nombre_usuario: string;
  contrasena_encriptada: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [nombreCompleto, setNombreCompleto] = useState("");
  const [credenciales, setCredenciales] = useState<Credencial[]>([]);

  // Modal nueva contraseña
  const [modalAbierto, setModalAbierto] = useState(false);
  const [sitio, setSitio] = useState("");
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState("");

  // Modal detalle
  const [credencialSeleccionada, setCredencialSeleccionada] = useState<Credencial | null>(null);
  const [mostrarContrasena, setMostrarContrasena] = useState(false);

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setEmail(user.email ?? "");
      const { data: perfil } = await supabase
        .from("perfiles")
        .select("nombre, apellido")
        .eq("id", user.id)
        .single();
      if (perfil) {
        setNombreCompleto(`${perfil.nombre ?? ""} ${perfil.apellido ?? ""}`.trim());
      }
    }
    getUser();
    cargarCredenciales();
  }, []);

  async function cargarCredenciales() {
    const { data, error } = await supabase
      .from("credenciales")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) setCredenciales(data);
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  async function handleAgregarCredencial() {
    if (!sitio || !nombreUsuario || !contrasena) {
      setMensaje("Completá todos los campos.");
      return;
    }
    setGuardando(true);
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase.from("credenciales").insert({
      user_id: user?.id,
      sitio,
      nombre_usuario: nombreUsuario,
      contrasena_encriptada: contrasena,
    });
    if (error) {
      setMensaje(`Error: ${error.message}`);
    } else {
      setSitio("");
      setNombreUsuario("");
      setContrasena("");
      setMensaje("");
      setModalAbierto(false);
      cargarCredenciales();
    }
    setGuardando(false);
  }

  function cerrarModal() {
    setModalAbierto(false);
    setSitio("");
    setNombreUsuario("");
    setContrasena("");
    setMensaje("");
  }

  function abrirDetalle(c: Credencial) {
    setCredencialSeleccionada(c);
    setMostrarContrasena(false);
  }

  function cerrarDetalle() {
    setCredencialSeleccionada(null);
    setMostrarContrasena(false);
  }

  return (
    <div className="flex h-screen bg-gray-100 text-black font-sans">
      {/* Barra Lateral */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col justify-between p-6">
        <div>
          <h1 className="text-2xl font-bold mb-8 text-blue-700">PassCore</h1>
          <nav className="flex flex-col gap-4">
            <button className="text-left font-bold py-2 px-4 rounded-xl bg-blue-50 text-blue-700">
              Tus Contraseñas
            </button>
          </nav>
        </div>
        <div className="flex items-center gap-3 font-bold text-sm text-gray-700">
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">👤</div>
          <div className="flex flex-col min-w-0">
            {nombreCompleto && <span className="font-bold truncate">{nombreCompleto}</span>}
            <span className="truncate text-xs text-gray-500">{email || "Cargando..."}</span>
          </div>
        </div>
      </aside>

      {/* Panel Principal */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-end px-6">
          <button
            onClick={handleSignOut}
            className="border border-gray-300 px-4 py-2 rounded-xl font-bold text-sm hover:bg-gray-100 transition-colors"
          >
            Cerrar Sesión
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          {credenciales.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="border border-gray-300 p-12 text-center max-w-xl w-full bg-white rounded-2xl shadow-sm">
                <h2 className="text-2xl font-bold text-gray-800 mb-8 uppercase tracking-wide">
                  Agregar Nueva Contraseña
                </h2>
                <button
                  onClick={() => setModalAbierto(true)}
                  className="bg-blue-700 text-white font-bold py-4 px-8 rounded-xl shadow-md hover:bg-blue-800 transition-all"
                >
                  + Contraseña
                </button>
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">Tus Contraseñas</h2>
                <button
                  onClick={() => setModalAbierto(true)}
                  className="bg-blue-700 text-white font-bold py-2 px-6 rounded-xl shadow-md hover:bg-blue-800 transition-all"
                >
                  + Contraseña
                </button>
              </div>
              <div className="flex flex-col gap-4">
                {credenciales.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => abrirDetalle(c)}
                    className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex justify-between items-center cursor-pointer hover:border-blue-300 hover:shadow-md transition-all"
                  >
                    <div>
                      <p className="font-bold text-gray-800 text-lg">{c.sitio}</p>
                      <p className="text-sm text-gray-500">{c.nombre_usuario}</p>
                    </div>
                    <span className="text-gray-400 font-mono tracking-widest">••••••••</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Modal nueva contraseña */}
      {modalAbierto && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4">
            <h2 className="text-xl font-bold text-gray-800 mb-6 uppercase tracking-wide">Nueva Contraseña</h2>
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Sitio / App</label>
                <input
                  type="text"
                  placeholder="ej: Google, Netflix..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-700 text-gray-900"
                  value={sitio}
                  onChange={(e) => setSitio(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Usuario / Email</label>
                <input
                  type="text"
                  placeholder="tu@email.com"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-700 text-gray-900"
                  value={nombreUsuario}
                  onChange={(e) => setNombreUsuario(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Contraseña</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-700 text-gray-900"
                  value={contrasena}
                  onChange={(e) => setContrasena(e.target.value)}
                />
              </div>
              {mensaje && <p className="text-red-600 text-sm font-bold">{mensaje}</p>}
              <div className="flex gap-3 mt-2">
                <button
                  onClick={cerrarModal}
                  className="flex-1 border border-gray-300 py-3 rounded-xl font-bold text-sm hover:bg-gray-100 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleAgregarCredencial}
                  disabled={guardando}
                  className="flex-1 bg-blue-700 text-white font-bold py-3 rounded-xl hover:bg-blue-800 transition-colors disabled:opacity-50"
                >
                  {guardando ? "Guardando..." : "Guardar"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal detalle de credencial */}
      {credencialSeleccionada && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4">
            <h2 className="text-xl font-bold text-gray-800 mb-6">{credencialSeleccionada.sitio}</h2>
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide">Usuario / Email</label>
                <p className="text-gray-800 font-medium bg-gray-50 px-4 py-3 rounded-xl border border-gray-200">
                  {credencialSeleccionada.nombre_usuario}
                </p>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide">Contraseña</label>
                <div className="flex items-center gap-2">
                  <p className="flex-1 text-gray-800 font-medium bg-gray-50 px-4 py-3 rounded-xl border border-gray-200 font-mono">
                    {mostrarContrasena ? credencialSeleccionada.contrasena_encriptada : "••••••••••••"}
                  </p>
                  <button
                    onClick={() => setMostrarContrasena(!mostrarContrasena)}
                    className="px-4 py-3 rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors text-lg"
                  >
                    {mostrarContrasena ? "🙈" : "👁"}
                  </button>
                </div>
              </div>
            </div>
            <button
              onClick={cerrarDetalle}
              className="w-full mt-6 border border-gray-300 py-3 rounded-xl font-bold text-sm hover:bg-gray-100 transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}