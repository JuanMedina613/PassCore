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

  const [modalAbierto, setModalAbierto] = useState(false);
  const [sitio, setSitio] = useState("");
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState("");

  const [credencialSeleccionada, setCredencialSeleccionada] = useState<Credencial | null>(null);
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [confirmandoEliminar, setConfirmandoEliminar] = useState<Credencial | null>(null);

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
      .order("sitio", { ascending: true });
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
      setSitio(""); setNombreUsuario(""); setContrasena("");
      setMensaje(""); setModalAbierto(false);
      cargarCredenciales();
    }
    setGuardando(false);
  }

  function cerrarModal() {
    setModalAbierto(false);
    setSitio(""); setNombreUsuario(""); setContrasena(""); setMensaje("");
  }

  function abrirDetalle(c: Credencial) {
    setCredencialSeleccionada(c);
    setMostrarContrasena(false);
  }

  function cerrarDetalle() {
    setCredencialSeleccionada(null);
    setMostrarContrasena(false);
  }

  async function handleEliminar(c: Credencial) {
    await supabase.from("credenciales").delete().eq("id", c.id);
    setCredencialSeleccionada(null);
    setConfirmandoEliminar(null);
    cargarCredenciales();
  }

  function getInicial(nombre: string) {
    return nombre.charAt(0).toUpperCase();
  }

  const avatarColors = ["#6366F1", "#22D3EE", "#A78BFA", "#34D399", "#F472B6", "#FB923C"];
  function getAvatarColor(nombre: string) {
    return avatarColors[nombre.charCodeAt(0) % avatarColors.length];
  }

  return (
    <div className="flex h-screen font-sans" style={{ background: "#0F172A", color: "#F8FAFC" }}>

      {/* Barra Lateral */}
      <aside className="w-64 flex flex-col justify-between py-8 px-5 border-r" style={{ background: "#1E293B", borderColor: "#334155" }}>
        <div>
          <div className="mb-10 px-2">
            <h1 className="text-2xl font-black tracking-tight" style={{ color: "#6366F1" }}>PassCore</h1>
            <p className="text-xs mt-1 font-medium" style={{ color: "#94A3B8" }}>Gestor de contraseñas</p>
          </div>
          <nav className="flex flex-col gap-1">
            <button
              className="text-left font-semibold py-2.5 px-4 rounded-xl flex items-center gap-3 text-sm"
              style={{ background: "#6366F1", color: "#F8FAFC" }}
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              Tus Contraseñas
            </button>
          </nav>
        </div>

        <div className="rounded-2xl p-4 border" style={{ background: "#0F172A", borderColor: "#334155" }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full flex items-center justify-center font-black text-white text-sm shrink-0" style={{ background: "#6366F1" }}>
              {(nombreCompleto || email).charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col min-w-0">
              {nombreCompleto && <span className="font-semibold truncate text-sm" style={{ color: "#F8FAFC" }}>{nombreCompleto}</span>}
              <span className="truncate text-xs" style={{ color: "#94A3B8" }}>{email || "Cargando..."}</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Panel Principal */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 flex items-center justify-between px-8 border-b" style={{ background: "#1E293B", borderColor: "#334155" }}>
          <p className="font-semibold text-sm" style={{ color: "#94A3B8" }}>
            {credenciales.length > 0
              ? `${credenciales.length} contraseña${credenciales.length !== 1 ? "s" : ""} guardada${credenciales.length !== 1 ? "s" : ""}`
              : "Bienvenido a PassCore"}
          </p>
          <button
            onClick={handleSignOut}
            className="px-4 py-2 rounded-xl font-semibold text-sm border transition-all"
            style={{ borderColor: "#334155", color: "#94A3B8", background: "transparent" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#6366F1"; e.currentTarget.style.color = "#F8FAFC"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "#334155"; e.currentTarget.style.color = "#94A3B8"; }}
          >
            Cerrar Sesión
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          {credenciales.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center p-14 rounded-3xl border max-w-sm w-full" style={{ background: "#1E293B", borderColor: "#334155" }}>
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6" style={{ background: "#6366F120" }}>
                  <svg width="28" height="28" fill="none" stroke="#6366F1" strokeWidth="2" viewBox="0 0 24 24">
                    <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </div>
                <h3 className="text-xl font-black mb-2" style={{ color: "#F8FAFC" }}>Sin contraseñas aún</h3>
                <p className="text-sm mb-8" style={{ color: "#94A3B8" }}>Guardá tus credenciales de forma segura y accedé desde cualquier lugar.</p>
                <button
                  onClick={() => setModalAbierto(true)}
                  className="font-bold py-3 px-8 rounded-xl w-full"
                  style={{ background: "#6366F1", color: "#F8FAFC" }}
                >
                  + Agregar Contraseña
                </button>
              </div>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-base font-bold" style={{ color: "#F8FAFC" }}>Todas las contraseñas</h3>
                <button
                  onClick={() => setModalAbierto(true)}
                  className="font-bold py-2 px-5 rounded-xl text-sm"
                  style={{ background: "#6366F1", color: "#F8FAFC" }}
                >
                  + Contraseña
                </button>
              </div>
              <div className="flex flex-col gap-2">
                {credenciales.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => abrirDetalle(c)}
                    className="rounded-2xl px-5 py-4 flex items-center gap-4 cursor-pointer transition-all border"
                    style={{ background: "#1E293B", borderColor: "#334155" }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = "#6366F1")}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = "#334155")}
                  >
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-white text-base shrink-0" style={{ background: getAvatarColor(c.sitio) }}>
                      {getInicial(c.sitio)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate text-sm" style={{ color: "#F8FAFC" }}>{c.sitio}</p>
                      <p className="text-xs truncate" style={{ color: "#94A3B8" }}>{c.nombre_usuario}</p>
                    </div>
                    <span className="font-mono text-sm tracking-widest" style={{ color: "#334155" }}>••••••</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Modal nueva contraseña */}
      {modalAbierto && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ background: "rgba(15,23,42,0.85)" }}>
          <div className="rounded-3xl shadow-2xl p-8 w-full max-w-md mx-4 border" style={{ background: "#1E293B", borderColor: "#334155" }}>
            <h2 className="text-lg font-black mb-6" style={{ color: "#F8FAFC" }}>Nueva Contraseña</h2>
            <div className="flex flex-col gap-4">
              {[
                { label: "Sitio / App", value: sitio, setter: setSitio, placeholder: "ej: Google, Netflix...", type: "text" },
                { label: "Usuario / Email", value: nombreUsuario, setter: setNombreUsuario, placeholder: "tu@email.com", type: "text" },
                { label: "Contraseña", value: contrasena, setter: setContrasena, placeholder: "••••••••", type: "password" },
              ].map(({ label, value, setter, placeholder, type }) => (
                <div key={label}>
                  <label className="block text-xs font-bold mb-2 uppercase tracking-wider" style={{ color: "#94A3B8" }}>{label}</label>
                  <input
                    type={type}
                    placeholder={placeholder}
                    className="w-full px-4 py-3 rounded-xl border outline-none text-sm font-medium transition-all"
                    style={{ background: "#0F172A", borderColor: "#334155", color: "#F8FAFC" }}
                    onFocus={e => (e.currentTarget.style.borderColor = "#6366F1")}
                    onBlur={e => (e.currentTarget.style.borderColor = "#334155")}
                    value={value}
                    onChange={(e) => setter(e.target.value)}
                  />
                </div>
              ))}
              {mensaje && <p className="text-xs font-bold" style={{ color: "#F472B6" }}>{mensaje}</p>}
              <div className="flex gap-3 mt-2">
                <button onClick={cerrarModal} className="flex-1 py-3 rounded-xl font-semibold text-sm border" style={{ borderColor: "#334155", color: "#94A3B8", background: "transparent" }}>
                  Cancelar
                </button>
                <button
                  onClick={handleAgregarCredencial}
                  disabled={guardando}
                  className="flex-1 py-3 rounded-xl font-bold text-sm disabled:opacity-50"
                  style={{ background: "#6366F1", color: "#F8FAFC" }}
                >
                  {guardando ? "Guardando..." : "Guardar"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal detalle */}
      {credencialSeleccionada && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ background: "rgba(15,23,42,0.85)" }}>
          <div className="rounded-3xl shadow-2xl p-8 w-full max-w-md mx-4 border" style={{ background: "#1E293B", borderColor: "#334155" }}>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center font-black text-white text-2xl shrink-0" style={{ background: getAvatarColor(credencialSeleccionada.sitio) }}>
                {getInicial(credencialSeleccionada.sitio)}
              </div>
              <div>
                <h2 className="text-xl font-black" style={{ color: "#F8FAFC" }}>{credencialSeleccionada.sitio}</h2>
                <p className="text-xs" style={{ color: "#94A3B8" }}>Credencial guardada</p>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold mb-2 uppercase tracking-wider" style={{ color: "#94A3B8" }}>Usuario / Email</label>
                <p className="px-4 py-3 rounded-xl text-sm font-medium border" style={{ background: "#0F172A", borderColor: "#334155", color: "#F8FAFC" }}>
                  {credencialSeleccionada.nombre_usuario}
                </p>
              </div>
              <div>
                <label className="block text-xs font-bold mb-2 uppercase tracking-wider" style={{ color: "#94A3B8" }}>Contraseña</label>
                <div className="flex items-center gap-2">
                  <p className="flex-1 px-4 py-3 rounded-xl font-mono text-sm border" style={{ background: "#0F172A", borderColor: "#334155", color: "#F8FAFC" }}>
                    {mostrarContrasena ? credencialSeleccionada.contrasena_encriptada : "••••••••••••"}
                  </p>
                  <button
                    onClick={() => setMostrarContrasena(!mostrarContrasena)}
                    className="px-4 py-3 rounded-xl text-xs font-bold border transition-all"
                    style={{ borderColor: "#334155", background: "#0F172A", color: "#94A3B8" }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "#6366F1"; e.currentTarget.style.color = "#6366F1"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "#334155"; e.currentTarget.style.color = "#94A3B8"; }}
                  >
                    {mostrarContrasena ? "Ocultar" : "Ver"}
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={() => setConfirmandoEliminar(credencialSeleccionada)}
              className="w-full mt-6 py-3 rounded-xl font-semibold text-sm border transition-all"
              style={{ borderColor: "#F472B640", color: "#F472B6", background: "transparent" }}
              onMouseEnter={e => (e.currentTarget.style.background = "#F472B620")}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
            >
              Eliminar
            </button>
            <button
              onClick={cerrarDetalle}
              className="w-full mt-3 py-3 rounded-xl font-semibold text-sm border transition-all"
              style={{ borderColor: "#334155", color: "#94A3B8", background: "transparent" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#6366F1"; e.currentTarget.style.color = "#F8FAFC"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#334155"; e.currentTarget.style.color = "#94A3B8"; }}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Modal confirmación eliminar */}
      {confirmandoEliminar && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ background: "rgba(15,23,42,0.9)" }}>
          <div className="rounded-3xl shadow-2xl p-8 w-full max-w-sm mx-4 border text-center" style={{ background: "#1E293B", borderColor: "#334155" }}>
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-6" style={{ background: "#F472B620" }}>
              <svg width="24" height="24" fill="none" stroke="#F472B6" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/>
              </svg>
            </div>
            <h2 className="text-lg font-black mb-2" style={{ color: "#F8FAFC" }}>¿Estás seguro?</h2>
            <p className="text-sm mb-8" style={{ color: "#94A3B8" }}>
              ¿Querés eliminar la clave de acceso de{" "}
              <span className="font-bold" style={{ color: "#F8FAFC" }}>{confirmandoEliminar.sitio}</span>?
              Esta acción no se puede deshacer.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmandoEliminar(null)}
                className="flex-1 py-3 rounded-xl font-semibold text-sm border"
                style={{ borderColor: "#334155", color: "#94A3B8", background: "transparent" }}
              >
                Cancelar
              </button>
              <button
                onClick={() => handleEliminar(confirmandoEliminar)}
                className="flex-1 py-3 rounded-xl font-bold text-sm"
                style={{ background: "#F472B6", color: "#F8FAFC" }}
              >
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}