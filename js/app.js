const form = document.getElementById('legoForm');
const container = document.getElementById('contenedorProductos');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const nombre = document.getElementById('nombre');
    if (nombre.value.length < 3) {
        nombre.classList.add('is-invalid');
        return;
    }

    const div = document.createElement('div');
    div.className = 'producto-card';
    div.innerHTML = `<h3>${nombre.value}</h3>`;
    container.append(div);
    
    localStorage.setItem('ultimoLego', nombre.value);
    
    form.reset();
});