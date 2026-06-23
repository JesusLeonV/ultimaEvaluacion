export async function getProductos() {
    try {
        const response = await fetch('./data/productos.json');
        return await response.json();
    } catch (error) {
        console.error("Error al cargar JSON:", error);
        return [];
    }
}