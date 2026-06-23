import { getProductos } from './api.js';

const containerProductos = document.getElementById('contenedorProductos');
const filtroCategoria = document.getElementById('filtroCategoria');

let todosLosProductos = [];

document.addEventListener('DOMContentLoaded', async () => {
    const productosAPI = await getProductos();
    const productosLocales = JSON.parse(localStorage.getItem('misLegos') || '[]');
    
    todosLosProductos = [...productosAPI, ...productosLocales].map(p => ({
        ...p,
        categoria: p.categoria || (p.nombre.toLowerCase().includes('star wars') ? 'starwars' : 'technic')
    }));
    
    renderizarProductos(todosLosProductos);

    const containerComentarios = document.getElementById('contenedorComentarios');
    try {
        const response = await fetch('./data/comentarios.json');
        if (response.ok) {
            const comentarios = await response.json();
            comentarios.forEach(c => {
                const div = document.createElement('div');
                div.className = 'comentario-card';
                div.innerHTML = `
                    <div class="stars">${c.estrellas}</div>
                    <p class="text">"${c.comentario}"</p>
                    <h4 class="author">- ${c.autor}</h4>
                `;
                containerComentarios.appendChild(div);
            });
        }
    } catch (error) {
        console.error("Error al cargar los comentarios:", error);
    }
});

if (filtroCategoria) {
    filtroCategoria.addEventListener('change', (e) => {
        const seleccion = e.target.value;
        
        if (seleccion === 'todos') {
            renderizarProductos(todosLosProductos);
        } else {
            const productosFiltrados = todosLosProductos.filter(p => p.categoria === seleccion);
            renderizarProductos(productosFiltrados);
        }
    });
}

function renderizarProductos(arregloProductos) {
    containerProductos.innerHTML = ''; 
    
    arregloProductos.forEach((p, index) => {
        const div = document.createElement('div');
        div.className = 'producto-card';
        div.innerHTML = `
            <img src="https://loremflickr.com/300/200/lego,toy?lock=${index}" alt="Lego">
            <div class="card-body">
                <h3>${p.nombre}</h3>
                <div class="price-tag">$${p.precio}</div>
            </div>
        `;
        containerProductos.appendChild(div);
    });
}