# 🛠️ Kiby - Plataforma de Cursos Online
Kiby es una plataforma de e-learning moderna y responsiva construida con React y Tailwind CSS, con un backend completamente gestionado por Firebase (Authentication y Firestore). Permite la gestión de cursos, sistema de compras, cupones de descuento y un panel de administración completo, todo con soporte para Modo Oscuro.

## 🚀 Instalación y Puesta en Marcha
Sigue estos pasos para ejecutar el proyecto en tu máquina local:

1. Clonar el repositorio
bash

git clone <url-del-repositorio>
cd kiby
2. Instalar dependencias
bash

npm install
3. Configurar Firebase
El proyecto requiere credenciales de Firebase para funcionar. Por seguridad, estas credenciales no deben subirse al control de versiones.

## Crea un proyecto en Firebase Console.
Habilita Authentication (método de inicio de sesión: Correo electrónico/Contraseña).
Habilita Cloud Firestore (Comienza en modo de prueba para desarrollar).
Ve a la configuración del proyecto y copia tus credenciales web.
Crea un archivo .env.local en la raíz de tu proyecto y añade tus credenciales:
env

REACT_APP_FIREBASE_API_KEY=tu_api_key_aqui
REACT_APP_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=tu_proyecto_id
REACT_APP_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
REACT_APP_FIREBASE_APP_ID=tu_app_id
(Nota: Estas variables son leídas automáticamente en src/services/authService.js)

4. Ejecutar la aplicación
bash

npm start
La aplicación se abrirá automáticamente en http://localhost:3000.

## 📂 Arquitectura del Proyecto
El proyecto sigue una arquitectura modular basada en responsabilidades (Service/Repository Pattern), diseñada para escalar fácilmente:

text

src/
├── components/     # Componentes reutilizables de UI
│   └── ui/         # Elementos base (Button, Card, Input)
├── context/        # Estado global de la aplicación (AuthContext)
├── models/         # Definición de tipos de datos (JSDoc) para autocompletado
│   ├── User.js
│   ├── Module.js
│   └── Coupon.js
├── pages/          # Vistas principales (Login, Catalog, Admin, Profile...)
├── services/       # Lógica de negocio y conexión a APIs
│   ├── authService.js    # Configuración de Firebase y funciones de Autenticación
│   └── data/             # Servicios de datos separados por dominio (Patrón modular)
│       ├── moduleService.js  # CRUD de módulos y lógica de compras
│       ├── couponService.js  # CRUD y validación de cupones
│       └── index.js          # Punto de entrada centralizado (Barrel file)
├── App.js          # Enrutamiento principal, Layout y lógica de modo oscuro
└── index.css       # Estilos globales y directivas de Tailwind CSS
⚙️ Funcionalidades Principales
## 🔐 Autenticación completa: Registro e inicio de sesión con Firebase Auth.
🛒 Sistema de compras: Carrito, checkout y persistencia de compras en Firestore.
🎟️ Cupones de descuento: Validación en tiempo real contra la base de datos.
🛡️ Panel de Administración: Gestión de cursos, cupones y visualización de compradores (Rutas protegidas).
🌙 Modo Oscuro: Soporte completo para tema claro/oscuro con persistencia en localStorage.
📱 Diseño Responsive: Menú hamburguesa y diseño adaptado para móviles y tablets usando Tailwind CSS.
📝 Autocompletado JSDoc: Tipado de datos integrado mediante @typedef para un desarrollo más rápido y seguro.
💾 Notas sobre Firestore (Base de Datos)
A diferencia de versiones anteriores que usaban LocalStorage, toda la persistencia de datos ahora vive en Cloud Firestore.

Para que la aplicación funcione correctamente en tu entorno de desarrollo, asegúrate de tener creadas las siguientes colecciones en tu base de datos de Firestore:

users: Se crea automáticamente al registrar un usuario (contiene email, role, purchases).
modules: Almacena los cursos (title, desc, price, img, features, etc.).
coupons: Almacena los cupones (code, discount, active, etc.).
(Puedes crear los primeros documentos manualmente desde la consola de Firebase para probar el catálogo).

## 🛠️ Scripts Disponibles
En el directorio del proyecto, puedes ejecutar:

npm start
Ejecuta la aplicación en modo de desarrollo.
Abre http://localhost:3000 para verla en tu navegador. La página se recargará automáticamente si realizas cambios.

npm run build
Construye la aplicación para producción en la carpeta build.
Optimiza el código y lo minimiza para obtener el mejor rendimiento. Tu aplicación estará lista para ser desplegada.

npm run eject
Nota: esta es una operación irreversible. Si no estás satisfecho con la herramienta de compilación y las opciones de configuración, puedes expulsar en cualquier momento. Te proporcionará control total sobre los archivos de configuración (Webpack, Babel, ESLint, etc).

## 🌐 Despliegue
La forma más sencilla de poner la aplicación en producción es utilizando Vercel o Netlify:

Sube tu código actualizado a tu repositorio de GitHub.
Conecta tu repositorio en Vercel o Netlify.
¡Importante! Ve a la configuración de "Environment Variables" en tu plataforma de despliegue y añade todas las variables de tu archivo .env.local (REACT_APP_FIREBASE_API_KEY, etc.).
¡Despliega!