require('dotenv').config();
const express = require('express');
const path = require('path');
const pool = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3000;

const ROOT = path.resolve(__dirname, '../../../');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(ROOT));

// RUTAS DE NAVEGACIÓN
app.get('/', (req, res) => res.sendFile(path.join(ROOT, 'index.html')));
app.get('/productos', (req, res) => res.sendFile(path.join(ROOT, 'src', 'main', 'inventario', 'html', 'productos.html')));
app.get('/registro', (req, res) => res.sendFile(path.join(ROOT, 'src', 'main', 'inventario', 'html', 'registro.html')));

// API - PRODUCTOS

// 1. Obtener todos los productos
app.get('/api/productos', async (req, res) => {
    try {
        const resultado = await pool.query('SELECT * FROM productos ORDER BY id DESC');
        res.json(resultado.rows);
    } catch (err) {
        console.error('Error al consultar productos:', err);
        res.status(500).json({ mensaje: 'Error al obtener productos' });
    }
});

// 2. Buscar producto por código
app.get('/api/productos/:codigo', async (req, res) => {
    try {
        const { codigo } = req.params;
        const resultado = await pool.query('SELECT * FROM productos WHERE codigo = $1', [codigo]);

        if (resultado.rows.length === 0) {
            return res.status(404).json({ mensaje: 'Producto no encontrado' });
        }
        res.json(resultado.rows[0]);
    } catch (err) {
        console.error('Error al buscar producto:', err);
        res.status(500).json({ mensaje: 'Error en el servidor' });
    }
});

// 3. Registrar producto
app.post('/api/productos', async (req, res) => {
    try {
        const { codigo, nombre, categoria, precio, cantidad } = req.body;
        const sql = `INSERT INTO productos (codigo, nombre, categoria, precio, cantidad) VALUES ($1, $2, $3, $4, $5) RETURNING id`;
        const resultado = await pool.query(sql, [codigo, nombre, categoria, precio, cantidad]);

        res.json({ mensaje: '¡Producto registrado con éxito!', id: resultado.rows[0].id });
    } catch (err) {
        console.error('Error al registrar producto:', err);
        res.status(500).json({ mensaje: 'No se pudo registrar el producto' });
    }
});

// 4. Actualizar producto
app.put('/api/productos/:codigo', async (req, res) => {
    try {
        const { codigo } = req.params;
        const { nombre, categoria, precio, cantidad } = req.body;
        const sql = `UPDATE productos SET nombre = $1, categoria = $2, precio = $3, cantidad = $4 WHERE codigo = $5`;

        await pool.query(sql, [nombre, categoria, precio, cantidad, codigo]);
        res.json({ mensaje: 'Producto actualizado correctamente' });
    } catch (err) {
        console.error('Error al actualizar producto:', err);
        res.status(500).json({ mensaje: 'Error al actualizar el producto' });
    }
});

// 5. Eliminar producto
app.delete('/api/productos/:codigo', async (req, res) => {
    try {
        const { codigo } = req.params;
        await pool.query('DELETE FROM productos WHERE codigo = $1', [codigo]);
        res.json({ mensaje: 'Producto eliminado correctamente' });
    } catch (err) {
        console.error('Error al eliminar producto:', err);
        res.status(500).json({ mensaje: 'Error al eliminar' });
    }
});

// Inicio del servidor
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});

module.exports = app;