function crearProducto(datos) {
    return {
        codigo: datos.codigo?.trim(),
        nombre: datos.nombre?.trim(),
        categoria: datos.categoria?.trim(),
        precio: Number(datos.precio),
        cantidad: Number(datos.cantidad)
    };
}

module.exports = {
    crearProducto
};