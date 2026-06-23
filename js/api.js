export async function getProductos() {
    try {
        const response = await fetch('../data/productos.json');
        if (!response.ok) throw new Error('Error al cargar datos');
        return await response.json();
    } catch (error) {
        console.error("Fallo en la API:", error);
        return [];
    }
}