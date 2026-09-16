const repository = require("../repository/productos.repository");
const { crearProducto } = require("../model/productos.model");


// Obtener todos
async function obtenerProductos() {

    return await repository.obtenerTodos();
}


// Obtener por código
async function obtenerProducto(codigo) {

    const producto = await repository.obtenerPorCodigo(codigo);

    if (!producto) {
        const error = new Error("Producto no encontrado");
        error.status = 404;
        throw error;
    }

    return producto;
}


// Crear
async function crearProductoService(datos) {

    const producto = crearProducto(datos);

    validarProducto(producto);

    const existente = await repository.obtenerPorCodigo(producto.codigo);

    if (existente) {
        const error = new Error(
            "Ya existe un producto con ese código"
        );

        error.status = 409;

        throw error;
    }

    const resultado = await repository.crear(producto);

    return {
        id: resultado.insertId,
        ...producto
    };
}


// Actualizar
async function actualizarProducto(codigo, datos) {

    const producto = crearProducto({
        ...datos,
        codigo
    });

    validarProducto(producto);

    const existente = await repository.obtenerPorCodigo(codigo);

    if (!existente) {
        const error = new Error("Producto no encontrado");
        error.status = 404;
        throw error;
    }

    await repository.actualizar(codigo, producto);

    return {
        ...existente,
        ...producto
    };
}


// Eliminar
async function eliminarProducto(codigo) {

    const existente = await repository.obtenerPorCodigo(codigo);

    if (!existente) {
        const error = new Error("Producto no encontrado");
        error.status = 404;
        throw error;
    }

    await repository.eliminar(codigo);

    return existente;
}


// Validaciones
function validarProducto(producto) {

    if (!producto.codigo) {
        const error = new Error("El código es obligatorio");
        error.status = 400;
        throw error;
    }

    if (!producto.nombre) {
        const error = new Error("El nombre es obligatorio");
        error.status = 400;
        throw error;
    }

    if (!producto.categoria) {
        const error = new Error("La categoría es obligatoria");
        error.status = 400;
        throw error;
    }

    if (
        Number.isNaN(producto.precio) ||
        producto.precio < 0
    ) {
        const error = new Error("El precio no es válido");
        error.status = 400;
        throw error;
    }

    if (
        Number.isNaN(producto.cantidad) ||
        producto.cantidad < 0
    ) {
        const error = new Error("La cantidad no es válida");
        error.status = 400;
        throw error;
    }
}


module.exports = {
    obtenerProductos,
    obtenerProducto,
    crearProducto: crearProductoService,
    actualizarProducto,
    eliminarProducto
};