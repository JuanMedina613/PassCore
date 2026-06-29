import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="text-black font-sans scroll-smooth" style={{ background: "#0F172A" }}>
      
      {/* 1. SECCIÓN */}
      <div className="min-h-screen flex flex-col">
        <header className="flex justify-between items-center p-6 border-b" style={{ background: "#1E293B", borderColor: "#334155" }}>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: "#6366F1" }}>PassCore</h1>
          <Link 
            href="/login" 
            className="font-bold px-5 py-2 rounded-xl border transition-all shadow-sm"
            style={{ borderColor: "#334155", color: "#F8FAFC", background: "#1E293B" }}
          >
            Iniciar Sesión
          </Link>
        </header>

        <main className="flex-1 flex flex-col items-center justify-center text-center p-8">
          <h2 className="text-5xl font-extrabold mb-6 uppercase tracking-wide" style={{ color: "#6366F1" }}>
            Tu Bóveda Digital
          </h2>
          <p className="text-xl mb-10 font-medium max-w-2xl" style={{ color: "#94A3B8" }}>
            Administrará, guardará y protegerá todas tus contraseñas en un solo lugar. 
            El gestor definitivo para tu seguridad y tranquilidad.
          </p>

          <a href="#detalles" className="mb-14 font-bold py-3 px-8 rounded-full shadow-md transition-all text-lg" style={{ background: "#6366F1", color: "#F8FAFC" }}>
            Saber más ↓
          </a>
          
          <div className="flex flex-col md:flex-row gap-8 w-full max-w-5xl justify-center">
            <div className="p-8 flex-1 rounded-2xl shadow-lg border hover:-translate-y-2 transition-transform" style={{ background: "#1E293B", borderColor: "#334155" }}>
              <h3 className="font-bold text-xl mb-3" style={{ color: "#F8FAFC" }}>🔒 Seguro</h3>
              <p className="text-base font-medium leading-relaxed" style={{ color: "#94A3B8" }}>
                Tus datos cifrados y protegidos contra cualquier amenaza externa.
              </p>
            </div>
            <div className="p-8 flex-1 rounded-2xl shadow-lg border hover:-translate-y-2 transition-transform" style={{ background: "#1E293B", borderColor: "#334155" }}>
              <h3 className="font-bold text-xl mb-3" style={{ color: "#F8FAFC" }}>⚡ Rápido</h3>
              <p className="text-base font-medium leading-relaxed" style={{ color: "#94A3B8" }}>
                Accede a tus credenciales inmediatamente sin perder un solo segundo.
              </p>
            </div>
            <div className="p-8 flex-1 rounded-2xl shadow-lg border hover:-translate-y-2 transition-transform" style={{ background: "#1E293B", borderColor: "#334155" }}>
              <h3 className="font-bold text-xl mb-3" style={{ color: "#F8FAFC" }}>👌 Fácil</h3>
              <p className="text-base font-medium leading-relaxed" style={{ color: "#94A3B8" }}>
                Una interfaz limpia, intuitiva y pensada para tu total comodidad.
              </p>
            </div>
          </div>
        </main>
      </div>

      {/* 2. TRANSICIÓN */}
      <div className="w-full h-48" style={{ background: "linear-gradient(to bottom, #0F172A, #1E293B)" }} aria-hidden="true" />

      {/* 3. SECCIÓN */}
      <section id="detalles" className="min-h-screen flex flex-col items-center justify-center p-12 text-center pb-24" style={{ background: "#1E293B" }}>
        <h2 className="text-5xl font-extrabold mb-10 uppercase tracking-wide" style={{ color: "#F8FAFC" }}>
          ¿Por qué PassCore?
        </h2>
        <div className="max-w-3xl p-10 rounded-3xl shadow-2xl" style={{ background: "#0F172A", border: "1px solid #334155" }}>
          <p className="text-xl font-medium leading-relaxed" style={{ color: "#94A3B8" }}>
            PassCore no es solo un bloc de notas. Utiliza la potencia de bases de datos modernas para asegurar que tus contraseñas estén siempre disponibles para vos, y ocultas para el resto del mundo. Gracias a la encriptación avanzada y nuestras políticas de seguridad, tenés el control absoluto.
          </p>
        </div>
      </section>

    </div>
  );
}