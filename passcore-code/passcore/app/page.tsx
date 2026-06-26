import Link from "next/link"; // <-- Importamos el componente Link de Next.js

export default function LandingPage() {
  return (
    <div className="bg-gray-50 text-black font-sans scroll-smooth">
      
      {/* 1. SECCIÓN BLANCA */}
      <div className="min-h-screen flex flex-col">
        {/* Barra de Navegación */}
<header className="flex justify-between items-center p-6 border-b border-gray-200 bg-white">
  <h1 className="text-2xl font-bold tracking-tight text-blue-600">PassCore</h1>
  
  {/* ACÁ ESTÁ EL BOTÓN ACTUALIZADO CON LINK */}
  <Link 
    href="/login" 
    className="font-bold border border-gray-300 px-5 py-2 rounded-xl bg-white text-black hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all shadow-sm"
  >
    Iniciar Sesión
  </Link>
</header>

        {/* Contenido Principal */}
        <main className="flex-1 flex flex-col items-center justify-center text-center p-8">
          <h2 className="text-5xl font-extrabold mb-6 text-blue-600 uppercase tracking-wide">
            Tu Bóveda Digital
          </h2>
          <p className="text-xl mb-10 font-medium max-w-2xl text-gray-600">
            Administrará, guardará y protegerá todas tus contraseñas en un solo lugar. 
            El gestor definitivo para tu seguridad y tranquilidad.
          </p>

          <a href="#detalles" className="mb-14 bg-blue-600 text-white font-bold py-3 px-8 rounded-full shadow-md hover:translate-y-1 hover:shadow-lg hover:bg-blue-700 transition-all text-lg">
            Saber más ↓
          </a>
          
          <div className="flex flex-col md:flex-row gap-8 w-full max-w-5xl justify-center">
            <div className="p-8 flex-1 bg-white rounded-2xl shadow-lg border border-gray-100 hover:-translate-y-2 transition-transform">
              <h3 className="font-bold text-xl mb-3 text-gray-800">🔒 Seguro</h3>
              <p className="text-base font-medium text-gray-500 leading-relaxed">
                Tus datos cifrados y protegidos contra cualquier amenaza externa.
              </p>
            </div>
            <div className="p-8 flex-1 bg-white rounded-2xl shadow-lg border border-gray-100 hover:-translate-y-2 transition-transform">
              <h3 className="font-bold text-xl mb-3 text-gray-800">⚡ Rápido</h3>
              <p className="text-base font-medium text-gray-500 leading-relaxed">
                Accede a tus credenciales inmediatamente sin perder un solo segundo.
              </p>
            </div>
            <div className="p-8 flex-1 bg-white rounded-2xl shadow-lg border border-gray-100 hover:-translate-y-2 transition-transform">
              <h3 className="font-bold text-xl mb-3 text-gray-800">👌 Fácil</h3>
              <p className="text-base font-medium text-gray-500 leading-relaxed">
                Una interfaz limpia, intuitiva y pensada para tu total comodidad.
              </p>
            </div>
          </div>
        </main>
      </div>

      {/* 2. TRANSICIÓN DIFUMINADA */}
    <div className="w-full h-48 bg-linear-to-b from-gray-50 to-blue-600" aria-hidden="true" />      {/* 3. SECCIÓN AZUL */}
      <section id="detalles" className="bg-blue-600 text-white min-h-screen flex flex-col items-center justify-center p-12 text-center pb-24">
        <h2 className="text-5xl font-extrabold mb-10 uppercase tracking-wide">
          ¿Por qué PassCore?
        </h2>
        <div className="max-w-3xl bg-blue-500 p-10 rounded-3xl shadow-2xl">
          <p className="text-xl font-medium leading-relaxed">
            PassCore no es solo un bloc de notas. Utiliza la potencia de bases de datos modernas para asegurar que tus contraseñas estén siempre disponibles para vos, y ocultas para el resto del mundo. Gracias a la encriptación avanzada y nuestras políticas de seguridad, tenés el control absoluto.
          </p>
        </div>
      </section>
    </div>
  );
}