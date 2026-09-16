const db = require("../config/database");

// Obtener todos los productos
async function obtenerTodos() {

    const [resultados] = await db.query(
        "SELECT * FROM productos ORDER BY id DESC"
    );

    return resultados;
}


// Obtener un producto por código
async function obtenerPorCodigo(codigo) {

    const [resultados] = await db.query(
        "SELECT * FROM productos WHERE codigo = ?",
        [codigo]
    );

    return resultados[0] || null;
}


// Crear producto
async function crear(producto) {

    const [resultado] = await db.query(
        `INSERT INTO productos
        (codigo, nombre, categoria, precio, cantidad)
        VALUES (?, ?, ?, ?, ?)`,
        [
            producto.codigo,
            producto.nombre,
            producto.categoria,
            producto.precio,
            producto.cantidad
        ]
    );

    return resultado;
}


// Actualizar producto
async function actualizar(codigo, producto) {

    const [resultado] = await db.query(
        `UPDATE productos
         SET nombre = ?,
             categoria = ?,
             precio = ?,
             cantidad = ?
         WHERE codigo = ?`,
        [
            producto.nombre,
            producto.categoria,
            producto.precio,
            producto.cantidad,
            codigo
        ]
    );

    return resultado;
}


// Eliminar producto
async function eliminar(codigo) {

    const [resultado] = await db.query(
        "DELETE FROM productos WHERE codigo = ?",
        [codigo]
    );

    return resultado;
}


module.exports = {
    obtenerTodos,
    obtenerPorCodigo,
    crear,
    actualizar,
    eliminar
};