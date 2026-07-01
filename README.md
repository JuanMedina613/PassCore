
## 📖 De qué trata el proyecto
**PassCore** es un gestor de contraseñas seguro y para todo publico. El objetivo principal es ofrecerle a los usuarios una "boveda digital" donde puedan administrar y proteger sus credenciales de acceso. El sistema cuenta con autenticación de usuarios y asegura que cada persona solo pueda acceder y gestionar su propia información.

---

## 🏗️ Tecnologías y Arquitectura Elegidas

Para construir una aplicación escalable, segura y con una excelente experiencia de usuario, se optó por un stack moderno:

* **Frontend / Framework:** Next.js (App Router) + TypeScript. Permite un desarrollo ágil con un enrutamiento nativo muy sólido. TypeScript aporta un tipado estricto que previene errores y asegura un código más robusto antes de compilar.
* **Estilos:** Tailwind CSS. Facilita la creación de una interfaz moderna, logrando un diseño limpio (estilo SaaS) de manera muy rápida.
* **Backend & Autenticación:** Supabase (Auth). Provee un sistema de registro e inicio de sesión seguro y fácil de implementar.
* **Base de Datos:** PostgreSQL (vía Supabase). Se utilizó para almacenar los perfiles y las credenciales. Se implementó **Row Level Security (RLS)** en las tablas para garantizar que ningún usuario pueda consultar información de terceros.
* **Seguridad y Encriptación (Client-Side)**: Se integró la librería *crypto-js* para encriptar las contraseñas localmente usando el estándar AES antes de enviarlas a la base de datos. Esto asegura que la base de datos almacene únicamente texto cifrado, añadiendo una capa robusta de privacidad.

---

## 🤖 Uso de Herramientas de IA (Inteligencia Artificial)

Durante el desarrollo de PassCore, utilicé **Gemini y Claude** como asistente de IA para optimizar y acelerar diferentes fases del proyecto:
* **Arquitectura y Toma de Decisiones:** Evaluación del stack tecnológico y migración de HTML/TS puro a Next.js para un resultado más profesional.
* **Debugging y Configuración:** Asistencia clave para interpretar y solucionar errores complejos de Supabase.

---

## 👨‍👩‍👧‍👦 Experiencia de Usuario (UX) y Feedback

Durante el desarrollo de PassCore, se realizó un proceso de validación con usuarios reales para recopilar opiniones sobre la interfaz y la sensación general al utilizar la aplicación. 

Gracias a esta interacción, se lograron implementar mejoras clave:
* **Diseño Visual:** La paleta de colores definitiva se ajustó basándose en el *feedback* recibido, optando por tonos sobrios y contrastes suaves que transmiten seguridad y resultan cómodos a la vista.
* **Usabilidad Intuitiva:** Las personas que probaron la aplicación destacaron que la navegación es muy simple, confirmando que la administración de credenciales es un proceso fácil de entender desde el primer momento.

---
## 🚀 Visión a Futuro (Roadmap)

Si bien PassCore es un espacio seguro donde podés administrar tus contraseñas con total confianza, la visión a largo plazo es que también funcione como un atajo inteligente hacia tus aplicaciones favoritas.

**Funcionalidad en planificación:**
* **Auto-Login con un clic:** El objetivo es que, al seleccionar una plataforma desde tu bóveda (ej: Netflix, Disney+, Instagram), el sistema te redirija e ingrese tus credenciales automáticamente, agilizando el acceso por completo.
  
---

## 🚀 Cómo instalarlo y correrlo localmente

### 1. Clonar el repositorio e instalar dependencias
Asegúrate de tener Node.js instalado y haber copiado el Repositorio en tu computadora, Luego necesitas la direccion en donde se encuentra PassCore  (Se deberia ver algo asi *...PassCore\passcore-code\passcore*), Luego Abre la tarminal y escribe lo siguiente

```bash
cd [Direccion_de_Passcore]
npm install
```

### 2. Configurar Variables de Entorno
Crea un archivo llamado `.env.local` en la direccion de donde estabas *...PassCore\passcore-code\passcore* y agrega tus credenciales de Supabase.

```env
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase_sin_rest_v1
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_de_supabase
```
⚠️ Nota para el evaluador sobre las credenciales:
Para agilizar la revisión de este challenge y que puedan probar la aplicación con datos y políticas (RLS) ya preconfiguradas, las credenciales del archivo .env.local serán enviadas por correo electrónico junto con la entrega.
Aclaración técnica: Soy consciente de que en un entorno de producción o en un equipo de trabajo real, las credenciales jamás se comparten por estos medios y cada entorno (desarrollo/producción) debe tener su propia instancia de base de datos aislada.

### 3. Iniciar el servidor de desarrollo
El comando `npm run dev` es estrictamente necesario porque actúa como un motor que compila tu código en tiempo real. Ejecútalo con:

```bash
npm run dev
```

Finalmente, abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver la aplicación funcionando.
