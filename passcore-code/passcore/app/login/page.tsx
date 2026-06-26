import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 font-sans p-4">
      
      <div className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-md border border-gray-100">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600 mb-2">PassCore</h1>
          <p className="text-gray-500 font-medium">Inicia sesión en tu bóveda</p>
        </div>

        <form className="flex flex-col gap-5">
          {/* Input Correo */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Correo Electrónico</label>
            <input 
              type="email" 
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
              placeholder="tu@email.com" 
            />
          </div>
          
          {/* Input Contraseña */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Contraseña</label>
            <input 
              type="password" 
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
              placeholder="••••••••" 
            />
          </div>

          {/* Botón Ingresar */}
          <button 
            type="button" 
            className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors shadow-md mt-4"
          >
            Ingresar
          </button>
        </form>

        <div className="mt-8 text-center">
          <Link href="/" className="text-sm text-gray-500 hover:text-blue-600 font-medium transition-colors">
            ← Volver al inicio
          </Link>
        </div>
      </div>
      
    </div>
  );
}