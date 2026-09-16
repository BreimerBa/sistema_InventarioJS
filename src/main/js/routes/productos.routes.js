const express = require("express");

const controller = require("../controller/productos.controller");

const router = express.Router();


// Obtener todos
router.get(
    "/",
    controller.obtenerProductos
);


// Obtener uno
router.get(
    "/:codigo",
    controller.obtenerProducto
);


// Crear
router.post(
    "/",
    controller.crearProducto
);


// Actualizar
router.put(
    "/:codigo",
    controller.actualizarProducto
);


// Eliminar
router.delete(
    "/:codigo",
    controller.eliminarProducto
);


module.exports = router;