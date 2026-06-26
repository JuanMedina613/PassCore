export default function DashboardPage() {
  return (
    <div className="flex h-screen bg-gray-100 text-black font-sans">
      {/* Barra Lateral */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col justify-between p-6">
        <div>
          <h1 className="text-2xl font-bold mb-8 text-blue-700">PassCore</h1>
          <nav className="flex flex-col gap-4">
            <button className="text-left font-bold py-2 px-4 rounded-xl hover:bg-gray-100 transition-colors">
              Configuracion
            </button>
            <button className="text-left font-bold py-2 px-4 rounded-xl bg-blue-50 text-blue-700">
              Tus Contraseñas
            </button>
          </nav>
        </div>
        <div className="flex items-center gap-3 font-bold text-sm text-gray-700">
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">👤</div>
          <span>Usuario</span>
        </div>
      </aside>

      {/* Panel Principal */}
      <main className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-end px-6">
          <button className="border border-gray-300 px-4 py-2 rounded-xl font-bold text-sm hover:bg-gray-100 transition-colors">
            Cerrar Sesión
          </button>
        </header>

        <div className="flex-1 flex items-center justify-center p-8">
          <div className="border border-gray-300 p-12 text-center max-w-xl w-full bg-white rounded-2xl shadow-sm">
            <h2 className="text-2xl font-bold text-gray-800 mb-8 uppercase tracking-wide">
              Agregar Nueva Contraseña
            </h2>
            <button className="bg-blue-700 text-white font-bold py-4 px-8 rounded-xl shadow-md hover:bg-blue-800 transition-all">
              + Contraseña
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}