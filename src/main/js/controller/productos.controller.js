const service = require("../service/productos.service");


// GET /api/productos
async function obtenerProductos(req, res) {

    try {

        const productos = await service.obtenerProductos();

        res.json(productos);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Error al obtener los productos"
        });
    }
}


// GET /api/productos/:codigo
async function obtenerProducto(req, res) {

    try {

        const { codigo } = req.params;

        const producto = await service.obtenerProducto(codigo);

        res.json(producto);

    } catch (error) {

        console.error(error);

        res.status(error.status || 500).json({
            error: error.message
        });
    }
}


// POST /api/productos
async function crearProducto(req, res) {

    try {

        const producto = await service.crearProducto(req.body);

        res.status(201).json({
            mensaje: "Producto registrado correctamente",
            producto
        });

    } catch (error) {

        console.error(error);

        res.status(error.status || 500).json({
            error: error.message
        });
    }
}


// PUT /api/productos/:codigo
async function actualizarProducto(req, res) {

    try {

        const { codigo } = req.params;

        const producto = await service.actualizarProducto(
            codigo,
            req.body
        );

        res.json({
            mensaje: "Producto actualizado correctamente",
            producto
        });

    } catch (error) {

        console.error(error);

        res.status(error.status || 500).json({
            error: error.message
        });
    }
}


// DELETE /api/productos/:codigo
async function eliminarProducto(req, res) {

    try {

        const { codigo } = req.params;

        await service.eliminarProducto(codigo);

        res.json({
            mensaje: "Producto eliminado correctamente"
        });

    } catch (error) {

        console.error(error);

        res.status(error.status || 500).json({
            error: error.message
        });
    }
}


module.exports = {
    obtenerProductos,
    obtenerProducto,
    crearProducto,
    actualizarProducto,
    eliminarProducto
};