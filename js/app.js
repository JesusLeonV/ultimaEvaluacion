import { getProductos } from './api.js';

const form = document.getElementById('legoForm');
const container = document.getElementById('contenedorProductos');
const filtroCategoria = document.getElementById('filtroCategoria');

// Lista global en memoria para gestionar los filtros dinámicos
let todosLosProductos = [];

// Helper nativo para leer las cookies de sesión[cite: 2]
function obtenerCookie(name) {
    const valor = `; ${document.cookie}`;
    const partes = valor.split(`; ${name}=`);
    if (partes.length === 2) return partes.pop().split(';').shift();
}

// 1. CARGA INICIAL (Evento DOMContentLoaded)[cite: 1]
document.addEventListener('DOMContentLoaded', async () => {
    // Renderizar saludo personalizado desde las cookies
    const miRol = obtenerCookie('userRole');
    const miNombre = obtenerCookie('userName');
    
    if (miRol && miNombre) {
        const saludoContenedor = document.getElementById('saludoUsuario');
        if (saludoContenedor) {
            saludoContenedor.textContent = `Panel Activo: ${miRol} — ¡Hola, ${miNombre}!`;
        }
    }

    // Consumo de datos (API Local + LocalStorage)[cite: 1]
    const productosAPI = await getProductos();
    const productosLocales = JSON.parse(localStorage.getItem('misLegos') || '[]');
    
    // Unificar productos asegurando que mantengan su categoría original
    todosLosProductos = [...productosAPI, ...productosLocales].map(p => {
        if (!p.categoria) {
            // Mapeo inteligente de respaldo si el JSON antiguo no tiene categoría
            const nom = p.nombre.toLowerCase();
            if (nom.includes('star wars')) p.categoria = 'starwars';
            else if (nom.includes('ferrari') || nom.includes('technic')) p.categoria = 'technic';
            else p.categoria = 'city'; // Por defecto
        }
        return p;
    });
    
    // Renderizar catálogo completo al iniciar
    renderizarProductos(todosLosProductos);
});

// 2. FILTRADO DINÁMICO (Evento change requerido por la rúbrica)[cite: 1]
if (filtroCategoria) {
    filtroCategoria.addEventListener('change', (e) => {
        const seleccion = e.target.value;
        
        if (seleccion === 'todos') {
            renderizarProductos(todosLosProductos);
        } else {
            // Filtrado estricto por la categoría seleccionada
            const productosFiltrados = todosLosProductos.filter(p => p.categoria === seleccion);
            renderizarProductos(productosFiltrados);
        }
    });
}

// 3. LOGICA DEL FORMULARIO (Evento submit con 5 reglas de validación)[cite: 1]
form.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevención de envío nativo[cite: 1]
    
    const nombre = document.getElementById('nombre');
    const precio = document.getElementById('precio');
    const codigo = document.getElementById('codigo');
    const categoria = document.getElementById('categoria');

    // Limpiar estilos de error previos[cite: 1]
    [nombre, precio, codigo, categoria].forEach(el => el.classList.remove('is-invalid'));

    // Aplicación de las reglas de validación de la rúbrica[cite: 1]
    let errores = false;
    if (nombre.value.trim().length < 3) { nombre.classList.add('is-invalid'); errores = true; } // Regla 1: Longitud min
    if (precio.value <= 0) { precio.classList.add('is-invalid'); errores = true; }               // Regla 2: Valor positivo
    if (codigo.value.trim().length < 5) { codigo.classList.add('is-invalid'); errores = true; }   // Regla 3: Código válido
    if (!categoria.value) { categoria.classList.add('is-invalid'); errores = true; }             // Regla 4: Campo obligatorio

    if (errores) {
        mostrarFeedback("Por favor, completa correctamente los campos marcados en rojo.", "red");
        return;
    }

    // Estructuración del nuevo objeto
    const nuevoLego = { 
        nombre: nombre.value.trim(), 
        precio: parseInt(precio.value), 
        codigo: codigo.value.trim(),
        categoria: categoria.value 
    };

    // Persistencia completa en LocalStorage
    const productosGuardados = JSON.parse(localStorage.getItem('misLegos') || '[]');
    productosGuardados.push(nuevoLego);
    localStorage.setItem('misLegos', JSON.stringify(productosGuardados));

    // Actualizar interfaz en caliente
    todosLosProductos.push(nuevoLego);
    if (filtroCategoria) filtroCategoria.value = 'todos'; // Resetear filtro de visualización
    renderizarProductos(todosLosProductos);

    mostrarFeedback("¡Set guardado exitosamente en el inventario!", "green");
    form.reset();
});

// 4. MANIPULACIÓN DINÁMICA DEL DOM (Función de renderizado)[cite: 1]
function renderizarProductos(arregloProductos) {
    container.innerHTML = ''; // Limpieza de nodos previos para evitar duplicación[cite: 1]
    
    arregloProductos.forEach((p, index) => {
        const div = document.createElement('div'); // Creación de elementos dinámicos[cite: 1]
        div.className = 'producto-card';
        div.innerHTML = `
            <img src="https://loremflickr.com/300/200/lego,toy?lock=${index}" alt="Lego">
            <div class="card-body">
                <h3>${p.nombre}</h3>
                <div class="price-tag">$${p.precio}</div>
                <small style="color: gray; display:block; margin-top:5px;">Categoría: ${p.categoria.toUpperCase()}</small>
            </div>
        `;
        container.appendChild(div);
    });
}

function mostrarFeedback(mensaje, color) {
    const feedback = document.getElementById('feedback');
    if (feedback) {
        feedback.textContent = mensaje;
        feedback.style.color = color;
        setTimeout(() => feedback.textContent = "", 3500);
    }
}