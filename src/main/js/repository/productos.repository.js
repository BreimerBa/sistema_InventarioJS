const db = require("../config/database");

// Obtener todos los productos
async function obtenerTodos() {
    const resultado = await db.query(
        "SELECT * FROM productos ORDER BY id DESC"
    );

    return resultado.rows;
}

// Obtener un producto por código
async function obtenerPorCodigo(codigo) {
    const resultado = await db.query(
        "SELECT * FROM productos WHERE codigo = $1",
        [codigo]
    );

    return resultado.rows[0] || null;
}

// Crear producto
async function crear(producto) {
    const resultado = await db.query(
        `INSERT INTO productos
        (codigo, nombre, categoria, precio, cantidad)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *`,
        [
            producto.codigo,
            producto.nombre,
            producto.categoria,
            producto.precio,
            producto.cantidad
        ]
    );

    return resultado.rows[0];
}

// Actualizar producto
async function actualizar(codigo, producto) {
    const resultado = await db.query(
        `UPDATE productos
         SET nombre = $1,
             categoria = $2,
             precio = $3,
             cantidad = $4
         WHERE codigo = $5
         RETURNING *`,
        [
            producto.nombre,
            producto.categoria,
            producto.precio,
            producto.cantidad,
            codigo
        ]
    );

    return resultado.rows[0] || null;
}

// Eliminar producto
async function eliminar(codigo) {
    const resultado = await db.query(
        "DELETE FROM productos WHERE codigo = $1 RETURNING *",
        [codigo]
    );

    return resultado.rows[0] || null;
}

module.exports = {
    obtenerTodos,
    obtenerPorCodigo,
    crear,
    actualizar,
    eliminar
};