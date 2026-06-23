document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const emailInput = document.getElementById('email').value.trim();
    const passInput = document.getElementById('pass').value;

    try {
        const response = await fetch('./data/usuarios.json');
        if (!response.ok) throw new Error('Error en el servicio de usuarios');
        const usuarios = await response.json();

        const usuarioValido = usuarios.find(u => u.email === emailInput && u.clave === passInput);

        if (usuarioValido) {
            document.cookie = `userRole=${usuarioValido.rol}; max-age=3600; path=/`;
            document.cookie = `userName=${usuarioValido.nombre}; max-age=3600; path=/`;
            
            window.location.href = 'admin.html';
        } else {
            alert('Credenciales no autorizadas para el Almacén.');
        }
    } catch (error) {
        console.error(error);
        alert('Error crítico de autenticación.');
    }
});