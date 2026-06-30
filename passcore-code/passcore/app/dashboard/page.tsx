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
  const [modoOscuro, setModoOscuro] = useState(true);

  const [modalAbierto, setModalAbierto] = useState(false);
  const [sitio, setSitio] = useState("");
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState("");

  const [credencialSeleccionada, setCredencialSeleccionada] = useState<Credencial | null>(null);
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [confirmandoEliminar, setConfirmandoEliminar] = useState<Credencial | null>(null);

  // Modificar
  const [modoEdicion, setModoEdicion] = useState(false);
  const [sitioEdit, setSitioEdit] = useState("");
  const [usuarioEdit, setUsuarioEdit] = useState("");
  const [contrasenaEdit, setContrasenaEdit] = useState("");
  const [mostrarContrasenaEdit, setMostrarContrasenaEdit] = useState(false);
  const [guardandoEdit, setGuardandoEdit] = useState(false);
  const [mensajeEdit, setMensajeEdit] = useState("");

  // Configuración
  const [configAbierta, setConfigAbierta] = useState(false);
  const [seccionActiva, setSeccionActiva] = useState<"perfil" | "password" | "peligro" | null>("perfil");
  const [nombreEdit, setNombreEdit] = useState("");
  const [apellidoEdit, setApellidoEdit] = useState("");
  const [guardandoPerfil, setGuardandoPerfil] = useState(false);
  const [mensajePerfil, setMensajePerfil] = useState("");
  const [passActual, setPassActual] = useState("");
  const [passNueva, setPassNueva] = useState("");
  const [passConfirmar, setPassConfirmar] = useState("");
  const [cambiandoPass, setCambiandoPass] = useState(false);
  const [mensajePass, setMensajePass] = useState("");
  const [confirmandoBorrarCuenta, setConfirmandoBorrarCuenta] = useState(false);
  const [textoConfirmacion, setTextoConfirmacion] = useState("");
  const [borrandoCuenta, setBorrandoCuenta] = useState(false);
  const [mensajeBorrarCuenta, setMensajeBorrarCuenta] = useState("");

  const colores = modoOscuro
    ? { fondo: "#0F172A", panel: "#1E293B", borde: "#334155", texto: "#F8FAFC", textoSec: "#94A3B8" }
    : { fondo: "#F8FAFC", panel: "#FFFFFF", borde: "#E2E8F0", texto: "#0F172A", textoSec: "#64748B" };

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
        setNombreEdit(perfil.nombre ?? "");
        setApellidoEdit(perfil.apellido ?? "");
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
    setModoEdicion(false);
    setMensajeEdit("");
  }

  function cerrarDetalle() {
    setCredencialSeleccionada(null);
    setMostrarContrasena(false);
    setModoEdicion(false);
    setMensajeEdit("");
  }

  function activarEdicion(c: Credencial) {
    setSitioEdit(c.sitio);
    setUsuarioEdit(c.nombre_usuario);
    setContrasenaEdit(c.contrasena_encriptada);
    setMostrarContrasenaEdit(false);
    setMensajeEdit("");
    setModoEdicion(true);
  }

  function cancelarEdicion() {
    setModoEdicion(false);
    setMensajeEdit("");
  }

  async function handleGuardarEdicion() {
    if (!sitioEdit || !usuarioEdit || !contrasenaEdit) {
      setMensajeEdit("Completá todos los campos.");
      return;
    }
    if (!credencialSeleccionada) return;

    setGuardandoEdit(true);
    const { error } = await supabase
      .from("credenciales")
      .update({
        sitio: sitioEdit,
        nombre_usuario: usuarioEdit,
        contrasena_encriptada: contrasenaEdit,
      })
      .eq("id", credencialSeleccionada.id);

    if (error) {
      setMensajeEdit("Error al guardar los cambios.");
    } else {
      const actualizada = { ...credencialSeleccionada, sitio: sitioEdit, nombre_usuario: usuarioEdit, contrasena_encriptada: contrasenaEdit };
      setCredencialSeleccionada(actualizada);
      setModoEdicion(false);
      setMensajeEdit("");
      cargarCredenciales();
    }
    setGuardandoEdit(false);
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

  function abrirConfig() {
    setConfigAbierta(true);
    setSeccionActiva("perfil");
    setMensajePerfil(""); setMensajePass(""); setMensajeBorrarCuenta("");
    setPassActual(""); setPassNueva(""); setPassConfirmar("");
    setTextoConfirmacion(""); setConfirmandoBorrarCuenta(false);
  }

  function cerrarConfig() { setConfigAbierta(false); }

  function toggleSeccion(seccion: "perfil" | "password" | "peligro") {
    setSeccionActiva(seccionActiva === seccion ? null : seccion);
  }

  async function handleGuardarPerfil() {
    if (!nombreEdit || !apellidoEdit) { setMensajePerfil("Completá nombre y apellido."); return; }
    setGuardandoPerfil(true);
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase.from("perfiles").update({ nombre: nombreEdit, apellido: apellidoEdit }).eq("id", user?.id);
    if (error) { setMensajePerfil("Error al guardar."); }
    else { setMensajePerfil("¡Datos actualizados!"); setNombreCompleto(`${nombreEdit} ${apellidoEdit}`.trim()); }
    setGuardandoPerfil(false);
  }

  async function handleCambiarPassword() {
    if (!passActual || !passNueva || !passConfirmar) { setMensajePass("Completá todos los campos."); return; }
    if (passNueva !== passConfirmar) { setMensajePass("Las contraseñas nuevas no coinciden."); return; }
    if (passNueva.length < 6) { setMensajePass("La nueva contraseña debe tener al menos 6 caracteres."); return; }
    setCambiandoPass(true);
    const { error: errorLogin } = await supabase.auth.signInWithPassword({ email, password: passActual });
    if (errorLogin) { setMensajePass("La contraseña actual es incorrecta."); setCambiandoPass(false); return; }
    const { error: errorUpdate } = await supabase.auth.updateUser({ password: passNueva });
    if (errorUpdate) { setMensajePass("Error al cambiar la contraseña."); }
    else { setMensajePass("¡Contraseña actualizada!"); setPassActual(""); setPassNueva(""); setPassConfirmar(""); }
    setCambiandoPass(false);
  }

  async function handleBorrarCuenta() {
    if (textoConfirmacion !== "ELIMINAR") { setMensajeBorrarCuenta('Escribí "ELIMINAR" para confirmar.'); return; }
    setBorrandoCuenta(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { setMensajeBorrarCuenta("No se pudo verificar tu sesión."); setBorrandoCuenta(false); return; }
    const { data, error } = await supabase.functions.invoke("borrar-cuenta", {
      headers: { Authorization: `Bearer ${session.access_token}` },
    });
    if (error || data?.error) { setMensajeBorrarCuenta("Error al borrar la cuenta. Intentá de nuevo."); setBorrandoCuenta(false); return; }
    await supabase.auth.signOut();
    router.push("/");
  }

  return (
    <div className="flex h-screen font-sans" style={{ background: colores.fondo, color: colores.texto }}>

      {/* Barra Lateral */}
      <aside className="w-64 flex flex-col justify-between py-8 px-5 border-r" style={{ background: colores.panel, borderColor: colores.borde }}>
        <div>
          <div className="mb-10 px-2">
            <h1 className="text-2xl font-black tracking-tight" style={{ color: "#6366F1" }}>PassCore</h1>
            <p className="text-xs mt-1 font-medium" style={{ color: colores.textoSec }}>Gestor de contraseñas</p>
          </div>
          <nav className="flex flex-col gap-1">
            <button className="text-left font-semibold py-2.5 px-4 rounded-xl flex items-center gap-3 text-sm" style={{ background: "#6366F1", color: "#F8FAFC" }}>
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              Tus Contraseñas
            </button>
            <button
              onClick={abrirConfig}
              className="text-left font-semibold py-2.5 px-4 rounded-xl flex items-center gap-3 text-sm border transition-all"
              style={{ borderColor: colores.borde, color: colores.textoSec, background: "transparent" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#6366F1"; e.currentTarget.style.color = colores.texto; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = colores.borde; e.currentTarget.style.color = colores.textoSec; }}
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
              </svg>
              Configuración
            </button>
          </nav>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => setModoOscuro(!modoOscuro)}
            className="flex items-center justify-between px-4 py-2.5 rounded-xl border text-sm font-semibold"
            style={{ borderColor: colores.borde, color: colores.textoSec, background: "transparent" }}
          >
            <span>{modoOscuro ? "Modo oscuro" : "Modo claro"}</span>
            {modoOscuro ? (
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
            ) : (
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
            )}
          </button>

          <div className="rounded-2xl p-4 border" style={{ background: colores.fondo, borderColor: colores.borde }}>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full flex items-center justify-center font-black text-white text-sm shrink-0" style={{ background: "#6366F1" }}>
                {(nombreCompleto || email).charAt(0).toUpperCase()}
              </div>
              <div className="flex flex-col min-w-0">
                {nombreCompleto && <span className="font-semibold truncate text-sm" style={{ color: colores.texto }}>{nombreCompleto}</span>}
                <span className="truncate text-xs" style={{ color: colores.textoSec }}>{email || "Cargando..."}</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Panel Principal */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 flex items-center justify-between px-8 border-b" style={{ background: colores.panel, borderColor: colores.borde }}>
          <p className="font-bold text-lg" style={{ color: colores.texto }}>
            {credenciales.length > 0
              ? `${credenciales.length} contraseña${credenciales.length !== 1 ? "s" : ""} guardada${credenciales.length !== 1 ? "s" : ""}`
              : "Bienvenido a PassCore"}
          </p>
          <button
            onClick={handleSignOut}
            className="px-4 py-2 rounded-xl font-semibold text-sm border transition-all"
            style={{ borderColor: colores.borde, color: colores.textoSec, background: "transparent" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#6366F1"; e.currentTarget.style.color = colores.texto; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = colores.borde; e.currentTarget.style.color = colores.textoSec; }}
          >
            Cerrar Sesión
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          {credenciales.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center p-14 rounded-3xl border max-w-sm w-full" style={{ background: colores.panel, borderColor: colores.borde }}>
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6" style={{ background: "#6366F120" }}>
                  <svg width="28" height="28" fill="none" stroke="#6366F1" strokeWidth="2" viewBox="0 0 24 24">
                    <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </div>
                <h3 className="text-xl font-black mb-2" style={{ color: colores.texto }}>Sin contraseñas aún</h3>
                <p className="text-sm mb-8" style={{ color: colores.textoSec }}>Guardá tus credenciales de forma segura y accedé desde cualquier lugar.</p>
                <button onClick={() => setModalAbierto(true)} className="font-bold py-3 px-8 rounded-xl w-full" style={{ background: "#6366F1", color: "#F8FAFC" }}>
                  + Agregar Contraseña
                </button>
              </div>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-base font-bold" style={{ color: colores.texto }}>Todas las contraseñas</h3>
                <button onClick={() => setModalAbierto(true)} className="font-bold py-2 px-5 rounded-xl text-sm" style={{ background: "#6366F1", color: "#F8FAFC" }}>
                  + Contraseña
                </button>
              </div>
              <div className="flex flex-col gap-2">
                {credenciales.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => abrirDetalle(c)}
                    className="rounded-2xl px-5 py-4 flex items-center gap-4 cursor-pointer transition-all border"
                    style={{ background: colores.panel, borderColor: colores.borde }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = "#6366F1")}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = colores.borde)}
                  >
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-white text-base shrink-0" style={{ background: getAvatarColor(c.sitio) }}>
                      {getInicial(c.sitio)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate text-sm" style={{ color: colores.texto }}>{c.sitio}</p>
                      <p className="text-xs truncate" style={{ color: colores.textoSec }}>{c.nombre_usuario}</p>
                    </div>
                    <span className="font-mono text-sm tracking-widest" style={{ color: colores.borde }}>••••••</span>
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
          <div className="rounded-3xl shadow-2xl p-8 w-full max-w-md mx-4 border" style={{ background: colores.panel, borderColor: colores.borde }}>
            <h2 className="text-lg font-black mb-6" style={{ color: colores.texto }}>Nueva Contraseña</h2>
            <div className="flex flex-col gap-4">
              {[
                { label: "Sitio / App", value: sitio, setter: setSitio, placeholder: "ej: Google, Netflix...", type: "text" },
                { label: "Usuario / Email", value: nombreUsuario, setter: setNombreUsuario, placeholder: "tu@email.com", type: "text" },
                { label: "Contraseña", value: contrasena, setter: setContrasena, placeholder: "••••••••", type: "password" },
              ].map(({ label, value, setter, placeholder, type }) => (
                <div key={label}>
                  <label className="block text-xs font-bold mb-2 uppercase tracking-wider" style={{ color: colores.textoSec }}>{label}</label>
                  <input
                    type={type} placeholder={placeholder}
                    className="w-full px-4 py-3 rounded-xl border outline-none text-sm font-medium transition-all"
                    style={{ background: colores.fondo, borderColor: colores.borde, color: colores.texto }}
                    onFocus={e => (e.currentTarget.style.borderColor = "#6366F1")}
                    onBlur={e => (e.currentTarget.style.borderColor = colores.borde)}
                    value={value} onChange={(e) => setter(e.target.value)}
                  />
                </div>
              ))}
              {mensaje && <p className="text-xs font-bold" style={{ color: "#F472B6" }}>{mensaje}</p>}
              <div className="flex gap-3 mt-2">
                <button onClick={cerrarModal} className="flex-1 py-3 rounded-xl font-semibold text-sm border" style={{ borderColor: colores.borde, color: colores.textoSec, background: "transparent" }}>Cancelar</button>
                <button onClick={handleAgregarCredencial} disabled={guardando} className="flex-1 py-3 rounded-xl font-bold text-sm disabled:opacity-50" style={{ background: "#6366F1", color: "#F8FAFC" }}>
                  {guardando ? "Guardando..." : "Guardar"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal detalle / edición */}
      {credencialSeleccionada && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ background: "rgba(15,23,42,0.85)" }}>
          <div className="rounded-3xl shadow-2xl p-8 w-full max-w-md mx-4 border" style={{ background: colores.panel, borderColor: colores.borde }}>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center font-black text-white text-2xl shrink-0" style={{ background: getAvatarColor(modoEdicion ? sitioEdit : credencialSeleccionada.sitio) }}>
                {getInicial(modoEdicion ? sitioEdit || credencialSeleccionada.sitio : credencialSeleccionada.sitio)}
              </div>
              <div>
                <h2 className="text-xl font-black" style={{ color: colores.texto }}>
                  {modoEdicion ? "Modificar credencial" : credencialSeleccionada.sitio}
                </h2>
                <p className="text-xs" style={{ color: colores.textoSec }}>
                  {modoEdicion ? "Editá los campos que querés cambiar" : "Credencial guardada"}
                </p>
              </div>
            </div>

            {modoEdicion ? (
              // MODO EDICIÓN
              <div className="flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-bold mb-2 uppercase tracking-wider" style={{ color: colores.textoSec }}>Sitio / App</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-xl border outline-none text-sm font-medium"
                    style={{ background: colores.fondo, borderColor: colores.borde, color: colores.texto }}
                    onFocus={e => (e.currentTarget.style.borderColor = "#6366F1")}
                    onBlur={e => (e.currentTarget.style.borderColor = colores.borde)}
                    value={sitioEdit}
                    onChange={(e) => setSitioEdit(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-2 uppercase tracking-wider" style={{ color: colores.textoSec }}>Usuario / Email</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-xl border outline-none text-sm font-medium"
                    style={{ background: colores.fondo, borderColor: colores.borde, color: colores.texto }}
                    onFocus={e => (e.currentTarget.style.borderColor = "#6366F1")}
                    onBlur={e => (e.currentTarget.style.borderColor = colores.borde)}
                    value={usuarioEdit}
                    onChange={(e) => setUsuarioEdit(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-2 uppercase tracking-wider" style={{ color: colores.textoSec }}>Contraseña</label>
                  <div className="flex gap-2">
                    <input
                      type={mostrarContrasenaEdit ? "text" : "password"}
                      className="flex-1 px-4 py-3 rounded-xl border outline-none text-sm font-medium font-mono"
                      style={{ background: colores.fondo, borderColor: colores.borde, color: colores.texto }}
                      onFocus={e => (e.currentTarget.style.borderColor = "#6366F1")}
                      onBlur={e => (e.currentTarget.style.borderColor = colores.borde)}
                      value={contrasenaEdit}
                      onChange={(e) => setContrasenaEdit(e.target.value)}
                    />
                    <button
                      onClick={() => setMostrarContrasenaEdit(!mostrarContrasenaEdit)}
                      className="px-4 py-3 rounded-xl text-xs font-bold border"
                      style={{ borderColor: colores.borde, background: colores.fondo, color: colores.textoSec }}
                    >
                      {mostrarContrasenaEdit ? "Ocultar" : "Ver"}
                    </button>
                  </div>
                </div>
                {mensajeEdit && <p className="text-xs font-bold" style={{ color: "#F472B6" }}>{mensajeEdit}</p>}
                <div className="flex gap-3 mt-2">
                  <button onClick={cancelarEdicion} className="flex-1 py-3 rounded-xl font-semibold text-sm border" style={{ borderColor: colores.borde, color: colores.textoSec, background: "transparent" }}>
                    Cancelar
                  </button>
                  <button onClick={handleGuardarEdicion} disabled={guardandoEdit} className="flex-1 py-3 rounded-xl font-bold text-sm disabled:opacity-50" style={{ background: "#6366F1", color: "#F8FAFC" }}>
                    {guardandoEdit ? "Guardando..." : "Guardar cambios"}
                  </button>
                </div>
              </div>
            ) : (
              // MODO VISTA
              <div className="flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-bold mb-2 uppercase tracking-wider" style={{ color: colores.textoSec }}>Usuario / Email</label>
                  <p className="px-4 py-3 rounded-xl text-sm font-medium border" style={{ background: colores.fondo, borderColor: colores.borde, color: colores.texto }}>
                    {credencialSeleccionada.nombre_usuario}
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-bold mb-2 uppercase tracking-wider" style={{ color: colores.textoSec }}>Contraseña</label>
                  <div className="flex items-center gap-2">
                    <p className="flex-1 px-4 py-3 rounded-xl font-mono text-sm border" style={{ background: colores.fondo, borderColor: colores.borde, color: colores.texto }}>
                      {mostrarContrasena ? credencialSeleccionada.contrasena_encriptada : "••••••••••••"}
                    </p>
                    <button
                      onClick={() => setMostrarContrasena(!mostrarContrasena)}
                      className="px-4 py-3 rounded-xl text-xs font-bold border"
                      style={{ borderColor: colores.borde, background: colores.fondo, color: colores.textoSec }}
                    >
                      {mostrarContrasena ? "Ocultar" : "Ver"}
                    </button>
                  </div>
                </div>

                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => activarEdicion(credencialSeleccionada)}
                    className="flex-1 py-3 rounded-xl font-semibold text-sm border transition-all"
                    style={{ borderColor: "#6366F1", color: "#6366F1", background: "transparent" }}
                    onMouseEnter={e => (e.currentTarget.style.background = "#6366F120")}
                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                  >
                    Modificar
                  </button>
                  <button
                    onClick={() => setConfirmandoEliminar(credencialSeleccionada)}
                    className="flex-1 py-3 rounded-xl font-semibold text-sm border transition-all"
                    style={{ borderColor: "#F472B640", color: "#F472B6", background: "transparent" }}
                    onMouseEnter={e => (e.currentTarget.style.background = "#F472B620")}
                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                  >
                    Eliminar
                  </button>
                </div>
                <button onClick={cerrarDetalle} className="w-full py-3 rounded-xl font-semibold text-sm border" style={{ borderColor: colores.borde, color: colores.textoSec, background: "transparent" }}>
                  Cerrar
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal confirmación eliminar */}
      {confirmandoEliminar && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ background: "rgba(15,23,42,0.9)" }}>
          <div className="rounded-3xl shadow-2xl p-8 w-full max-w-sm mx-4 border text-center" style={{ background: colores.panel, borderColor: colores.borde }}>
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-6" style={{ background: "#F472B620" }}>
              <svg width="24" height="24" fill="none" stroke="#F472B6" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/>
              </svg>
            </div>
            <h2 className="text-lg font-black mb-2" style={{ color: colores.texto }}>¿Estás seguro?</h2>
            <p className="text-sm mb-8" style={{ color: colores.textoSec }}>
              ¿Querés eliminar la clave de acceso de{" "}
              <span className="font-bold" style={{ color: colores.texto }}>{confirmandoEliminar.sitio}</span>?
              Esta acción no se puede deshacer.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmandoEliminar(null)} className="flex-1 py-3 rounded-xl font-semibold text-sm border" style={{ borderColor: colores.borde, color: colores.textoSec, background: "transparent" }}>Cancelar</button>
              <button onClick={() => handleEliminar(confirmandoEliminar)} className="flex-1 py-3 rounded-xl font-bold text-sm" style={{ background: "#F472B6", color: "#F8FAFC" }}>Sí, eliminar</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Configuración */}
      {configAbierta && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ background: "rgba(15,23,42,0.9)" }}>
          <div className="rounded-3xl shadow-2xl w-full max-w-3xl border max-h-[85vh] flex flex-col" style={{ background: colores.panel, borderColor: colores.borde }}>
            <div className="p-8 pb-4 border-b" style={{ borderColor: colores.borde }}>
              <h2 className="text-2xl font-black" style={{ color: colores.texto }}>Configuración</h2>
              <p className="text-sm mt-1" style={{ color: colores.textoSec }}>Administrá tu cuenta y preferencias</p>
            </div>

            <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-4">

              <div className="rounded-2xl border overflow-hidden" style={{ borderColor: colores.borde }}>
                <button onClick={() => toggleSeccion("perfil")} className="w-full flex items-center justify-between p-5 text-left" style={{ background: colores.fondo }}>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: "#6366F120" }}>
                      <svg width="18" height="18" fill="none" stroke="#6366F1" strokeWidth="2" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    </div>
                    <div>
                      <p className="font-bold text-sm" style={{ color: colores.texto }}>Datos personales</p>
                      <p className="text-xs" style={{ color: colores.textoSec }}>Nombre y apellido</p>
                    </div>
                  </div>
                  <svg width="18" height="18" fill="none" stroke={colores.textoSec} strokeWidth="2" viewBox="0 0 24 24" style={{ transform: seccionActiva === "perfil" ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>
                    <path d="M6 9l6 6 6-6"/>
                  </svg>
                </button>
                {seccionActiva === "perfil" && (
                  <div className="p-5 pt-0">
                    <div className="flex gap-3 mb-4 pt-4">
                      <div className="flex-1">
                        <label className="block text-xs font-bold mb-2" style={{ color: colores.textoSec }}>Nombre</label>
                        <input type="text" className="w-full px-4 py-3 rounded-xl border outline-none text-sm font-medium" style={{ background: colores.panel, borderColor: colores.borde, color: colores.texto }} value={nombreEdit} onChange={(e) => setNombreEdit(e.target.value)} />
                      </div>
                      <div className="flex-1">
                        <label className="block text-xs font-bold mb-2" style={{ color: colores.textoSec }}>Apellido</label>
                        <input type="text" className="w-full px-4 py-3 rounded-xl border outline-none text-sm font-medium" style={{ background: colores.panel, borderColor: colores.borde, color: colores.texto }} value={apellidoEdit} onChange={(e) => setApellidoEdit(e.target.value)} />
                      </div>
                    </div>
                    {mensajePerfil && <p className="text-xs font-bold mb-3" style={{ color: mensajePerfil.startsWith("¡") ? "#34D399" : "#F472B6" }}>{mensajePerfil}</p>}
                    <button onClick={handleGuardarPerfil} disabled={guardandoPerfil} className="font-bold py-2.5 px-5 rounded-xl text-sm disabled:opacity-50" style={{ background: "#6366F1", color: "#F8FAFC" }}>
                      {guardandoPerfil ? "Guardando..." : "Guardar datos"}
                    </button>
                  </div>
                )}
              </div>

              <div className="rounded-2xl border overflow-hidden" style={{ borderColor: colores.borde }}>
                <button onClick={() => toggleSeccion("password")} className="w-full flex items-center justify-between p-5 text-left" style={{ background: colores.fondo }}>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: "#22D3EE20" }}>
                      <svg width="18" height="18" fill="none" stroke="#22D3EE" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                    </div>
                    <div>
                      <p className="font-bold text-sm" style={{ color: colores.texto }}>Cambiar contraseña</p>
                      <p className="text-xs" style={{ color: colores.textoSec }}>Actualizá tu contraseña de acceso</p>
                    </div>
                  </div>
                  <svg width="18" height="18" fill="none" stroke={colores.textoSec} strokeWidth="2" viewBox="0 0 24 24" style={{ transform: seccionActiva === "password" ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>
                    <path d="M6 9l6 6 6-6"/>
                  </svg>
                </button>
                {seccionActiva === "password" && (
                  <div className="p-5 pt-0">
                    <div className="flex flex-col gap-3 mb-4 pt-4">
                      <div>
                        <label className="block text-xs font-bold mb-2" style={{ color: colores.textoSec }}>Contraseña actual</label>
                        <input type="password" placeholder="••••••••" className="w-full px-4 py-3 rounded-xl border outline-none text-sm" style={{ background: colores.panel, borderColor: colores.borde, color: colores.texto }} value={passActual} onChange={(e) => setPassActual(e.target.value)} />
                      </div>
                      <div className="flex gap-3">
                        <div className="flex-1">
                          <label className="block text-xs font-bold mb-2" style={{ color: colores.textoSec }}>Nueva contraseña</label>
                          <input type="password" placeholder="••••••••" className="w-full px-4 py-3 rounded-xl border outline-none text-sm" style={{ background: colores.panel, borderColor: colores.borde, color: colores.texto }} value={passNueva} onChange={(e) => setPassNueva(e.target.value)} />
                        </div>
                        <div className="flex-1">
                          <label className="block text-xs font-bold mb-2" style={{ color: colores.textoSec }}>Confirmar nueva</label>
                          <input type="password" placeholder="••••••••" className="w-full px-4 py-3 rounded-xl border outline-none text-sm" style={{ background: colores.panel, borderColor: colores.borde, color: colores.texto }} value={passConfirmar} onChange={(e) => setPassConfirmar(e.target.value)} />
                        </div>
                      </div>
                    </div>
                    {mensajePass && <p className="text-xs font-bold mb-3" style={{ color: mensajePass.startsWith("¡") ? "#34D399" : "#F472B6" }}>{mensajePass}</p>}
                    <button onClick={handleCambiarPassword} disabled={cambiandoPass} className="font-bold py-2.5 px-5 rounded-xl text-sm disabled:opacity-50" style={{ background: "#6366F1", color: "#F8FAFC" }}>
                      {cambiandoPass ? "Cambiando..." : "Cambiar contraseña"}
                    </button>
                  </div>
                )}
              </div>

              <div className="rounded-2xl border overflow-hidden" style={{ borderColor: "#F472B640" }}>
                <button onClick={() => toggleSeccion("peligro")} className="w-full flex items-center justify-between p-5 text-left" style={{ background: colores.fondo }}>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: "#F472B620" }}>
                      <svg width="18" height="18" fill="none" stroke="#F472B6" strokeWidth="2" viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><path d="M12 9v4M12 17h.01"/></svg>
                    </div>
                    <div>
                      <p className="font-bold text-sm" style={{ color: "#F472B6" }}>Zona de peligro</p>
                      <p className="text-xs" style={{ color: colores.textoSec }}>Borrar tu cuenta permanentemente</p>
                    </div>
                  </div>
                  <svg width="18" height="18" fill="none" stroke={colores.textoSec} strokeWidth="2" viewBox="0 0 24 24" style={{ transform: seccionActiva === "peligro" ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>
                    <path d="M6 9l6 6 6-6"/>
                  </svg>
                </button>
                {seccionActiva === "peligro" && (
                  <div className="p-5 pt-0">
                    <div className="pt-4">
                      {!confirmandoBorrarCuenta ? (
                        <>
                          <p className="text-sm mb-4" style={{ color: colores.textoSec }}>Esta acción eliminará tu cuenta y todas tus contraseñas guardadas de forma permanente. No se puede deshacer.</p>
                          <button onClick={() => setConfirmandoBorrarCuenta(true)} className="font-bold py-2.5 px-5 rounded-xl text-sm border" style={{ borderColor: "#F472B6", color: "#F472B6", background: "transparent" }}>
                            Quiero borrar mi cuenta
                          </button>
                        </>
                      ) : (
                        <>
                          <p className="text-sm mb-3" style={{ color: colores.texto }}>Para confirmar, escribí <span className="font-black">ELIMINAR</span> en el campo:</p>
                          <input type="text" placeholder="ELIMINAR" className="w-full px-4 py-3 rounded-xl border outline-none text-sm font-bold mb-3" style={{ background: colores.panel, borderColor: "#F472B6", color: colores.texto }} value={textoConfirmacion} onChange={(e) => setTextoConfirmacion(e.target.value)} />
                          {mensajeBorrarCuenta && <p className="text-xs font-bold mb-3" style={{ color: "#F472B6" }}>{mensajeBorrarCuenta}</p>}
                          <div className="flex gap-3">
                            <button onClick={() => { setConfirmandoBorrarCuenta(false); setTextoConfirmacion(""); setMensajeBorrarCuenta(""); }} className="flex-1 py-2.5 rounded-xl font-semibold text-sm border" style={{ borderColor: colores.borde, color: colores.textoSec, background: "transparent" }}>Cancelar</button>
                            <button onClick={handleBorrarCuenta} disabled={borrandoCuenta} className="flex-1 py-2.5 rounded-xl font-bold text-sm disabled:opacity-50" style={{ background: "#F472B6", color: "#F8FAFC" }}>
                              {borrandoCuenta ? "Borrando..." : "Borrar definitivamente"}
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>

            </div>

            <div className="p-8 pt-4 border-t" style={{ borderColor: colores.borde }}>
              <button onClick={cerrarConfig} className="w-full py-3 rounded-xl font-semibold text-sm border" style={{ borderColor: colores.borde, color: colores.textoSec, background: "transparent" }}>Cerrar</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}