# 🛠️ Instalación y Puesta en Marcha
Sigue estos pasos para ejecutar el proyecto en tu máquina local:

## 1. Clonar el repositorio

git clone <url-del-repositorio>cd kiby

## 2. Instalar

npm install

## 3. Configurar Firebase

El proyecto requiere credenciales de Firebase para funcionar. Estas credenciales no deben subirse a GitHub por seguridad.

Crea.env.localen la raíz de tu proyecto y añade tus credenciales:

entorno

REACT_APP_FIREBASE_API_KEY=tu_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=tu_proyecto_id
REACT_APP_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
REACT_APP_FIREBASE_APP_ID=tu_app_id

*(Nota: Actualmente las credenciales están en `src(Nota: Actualmente las credenciales están en , pero es recomendable moverlas a variables de entorno).src/config/constants.js

## 4. Ejecutar la aplicación
intento

npm start
Se abrirá http://localhost:3000 en tu navegador.

# 📂Arquitectura del proyecto
El proyecto sigue una arquitectura basada en responsabilidades:

texto

src/
├── components/     # Componentes reutilizables
│   └── ui/         # Botones, Cards, Inputs base
├── config/         # Constantes y configuración (Firebase, Categorías)
├── context/        # Estado global (AuthContext para Firebase)
├── models/         # Definición de tipos de datos (JSDoc)
├── pages/          # Vistas principales (Login, Catalog, Admin...)
├── services/       # Lógica de negocio y APIs (Firebase, LocalStorage)
├── App.js          # Enrutamiento y layout principal
└── index.css       # Estilos globales y directivas Tailwind

 # **⚙️ Scripts Disponibles** 
En npm start
Ejecute la aplicación en modo desarrollo. abre
http://localhost:3000 para verla en el navegador. La página se recargará

npm run build
Construye la aplicación para producción en la carpeta . Optimice el código para el mejor rendimiento. Tu aplicación estará listabuild

npm run eject
Nota: esta es una operación irreversible. Si no estás

# **💾 Notas sobre los Datos (LocalStorage)**
Para facilitar ellocalStoragedel

Si es la primera vez que abre la aplicación, se cargará **3 mod3 módulos por defecto con imágenes reales de Unsplash.
Para resetear los datos (si las imágenes
JavaScript

localStorage.removeItem('kiby_modules'); localStorage.removeItem('kiby_purchases'); location.reload();

# **🚀 Despliege**
Para poner la aplicación en producción, la forma más sencilla es usarVerceloNetlify:

Sube tu código a GitHub.
Conecte su repositorio en Vercel/Netlify.
Agregue las variables de entorno de Firebase en la configuración del despliegue.
¡Despliega!