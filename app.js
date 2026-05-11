// Importaciones de Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
    getAuth,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// 1. CONFIGURACIÓN DE TU PROYECTO (CLAVES DE FABRICACIÓN)
const firebaseConfig = {
    apiKey: "AIzaSyCCS2rwV6tVSjC1Qq1wbGwxw-CC463aySg",
    authDomain: "kiby-cce29.firebaseapp.com",
    projectId: "kiby-cce29",
    storageBucket: "kiby-cce29.firebasestorage.app",
    messagingSenderId: "943084875353",
    appId: "1:943084875353:web:a996c38bd9baa52a4f4b48",
    measurementId: "G-LCWTC4R9RM"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// 2. DATOS FALSOS (LOS MÓDULOS)
const modulesData = [
    { id: 1, title: "Introducción a Kiby", desc: "Aprende los fundamentos básicos de la plataforma y cómo empezar.", img: "https://via.placeholder.com/400x200?text=Intro" },
    { id: 2, title: "Gestión de Usuarios", desc: "Cómo crear cuentas nuevas y gestionar permisos.", img: "https://via.placeholder.com/400x200?text=Usuarios" },
    { id: 3, title: "Reportes Avanzados", desc: "Extrae datos y crea gráficos detallados.", img: "https://via.placeholder.com/400x200?text=Datos" },
    { id: 4, title: "Configuración API", desc: "Conecta Kiby con otros servicios externos.", img: "https://via.placeholder.com/400x200?text=API" },
    { id: 5, title: "Seguridad y Copias", desc: "Mantén tus datos a salvo con copias de seguridad.", img: "https://via.placeholder.com/400x200?text=Seguridad" }
];

// 3. LÓGICA DE SEGURIDAD (¿ESTÁ LOGUEADO O NO?)
onAuthStateChanged(auth, (user) => {
    const path = window.location.pathname;

    if (user) {
        // SI el usuario está logueado
        if (path.includes('index.html') || path.endsWith('/')) {
            window.location.href = 'dashboard.html'; // Manda al dashboard
        }

        if (path.includes('dashboard.html')) renderModules(); // Pinta los cuadros
        if (path.includes('detalle.html')) renderDetail(); // Pinta el detalle

    } else {
        // SI NO está logueado
        if (!path.includes('index.html') && !path.endsWith('/')) {
            window.location.href = 'index.html'; // Manda al login
        }
    }
});

// 4. LÓGICA PARA ENTRAR (LOGIN)
const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const errorMsg = document.getElementById('error-msg');

        try {
            await signInWithEmailAndPassword(auth, email, password);
            // Si funciona, el sistema redirige solo
        } catch (error) {
            errorMsg.textContent = "Error: Comprueba email y contraseña";
        }
    });
}

// 5. LÓGICA PARA PINTAR EL DASHBOARD
function renderModules() {
    const container = document.getElementById('modules-container');
    const loading = document.getElementById('loading-msg');

    if (container) {
        loading.style.display = 'none';
        container.innerHTML = '';

        modulesData.forEach(mod => {
            const card = document.createElement('div');
            card.className = 'module-card';
            card.innerHTML = `<h3>${mod.title}</h3><p>${mod.desc.substring(0, 50)}...</p>`;

            // Al hacer clic, va a detalle
            card.addEventListener('click', () => {
                window.location.href = `detalle.html?id=${mod.id}`;
            });

            container.appendChild(card);
        });
    }
}

// 6. LÓGICA PARA PINTAR EL DETALLE
function renderDetail() {
    // Cogemos el ID de la URL (ej: ?id=1)
    const params = new URLSearchParams(window.location.search);
    const moduleId = parseInt(params.get('id'));

    const detailContainer = document.getElementById('module-detail');
    const loading = document.getElementById('loading-detail');

    if (detailContainer) {
        const module = modulesData.find(m => m.id === moduleId);
        if (module) {
            loading.style.display = 'none';
            detailContainer.classList.remove('hidden');

            document.getElementById('detail-title').textContent = module.title;
            document.getElementById('detail-desc').textContent = module.desc + " (Este es el detalle completo del módulo que has seleccionado).";
        } else {
            loading.textContent = "Módulo no encontrado";
        }
    }
}

// 7. LÓGICA PARA SALIR (LOGOUT)
const logoutBtn = document.getElementById('logout-btn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        signOut(auth).then(() => window.location.href = 'index.html');
    });
}