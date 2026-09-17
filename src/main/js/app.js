/* const express = require('express');
const mysql = require('mysql2');
const path = require('path');

const app = express();

const ROOT = path.resolve(__dirname, '../../../');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// como CSS, JavaScript, imágenes, etc.
app.use(express.static(ROOT));

// CONEXIÓN MYSQL

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'inventario_web'
});

db.connect((err) => {
    if (err) {
        console.error('Error al conectar a MySQL:', err);
        return;
    }

    console.log('¡Conectado a MySQL exitosamente!');
});

// RUTAS DE NAVEGACIÓN

// Página principal
app.get('/', (req, res) => {
    res.sendFile(path.join(ROOT, 'index.html'));
});

// Página de productos
app.get('/productos', (req, res) => {
    res.sendFile(
        path.join(
            ROOT,
            'src',
            'main',
            'inventario',
            'html',
            'productos.html'
        )
    );
});

// Página de registro
app.get('/registro', (req, res) => {
    res.sendFile(
        path.join(
            ROOT,
            'src',
            'main',
            'inventario',
            'html',
            'registro.html'
        )
    );
});

// API - PRODUCTOS
// 1. Obtener todos los productos
app.get('/api/productos', (req, res) => {

    const sql = `
        SELECT *
        FROM productos
        ORDER BY id DESC
    `;

    db.query(sql, (err, resultados) => {

        if (err) {
            console.error('Error al consultar productos:', err);

            return res.status(500).json({
                mensaje: 'Error al obtener productos'
            });
        }

        res.json(resultados);
    });
});

// 2. Buscar producto por código
app.get('/api/productos/:codigo', (req, res) => {

    const { codigo } = req.params;

    const sql = `
        SELECT *
        FROM productos
        WHERE codigo = ?
    `;

    db.query(sql, [codigo], (err, resultados) => {

        if (err) {
            console.error('Error al buscar producto:', err);

            return res.status(500).json({
                mensaje: 'Error en el servidor'
            });
        }

        if (resultados.length === 0) {

            return res.status(404).json({
                mensaje: 'Producto no encontrado'
            });
        }

        res.json(resultados[0]);
    });
});

// 3. Registrar producto
app.post('/api/productos', (req, res) => {

    const {
        codigo,
        nombre,
        categoria,
        precio,
        cantidad
    } = req.body;

    const sql = `
        INSERT INTO productos
        (
            codigo,
            nombre,
            categoria,
            precio,
            cantidad
        )
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            codigo,
            nombre,
            categoria,
            precio,
            cantidad
        ],
        (err, resultado) => {

            if (err) {
                console.error(
                    'Error al registrar producto:',
                    err
                );

                return res.status(500).json({
                    mensaje:
                        'No se pudo registrar el producto'
                });
            }

            res.json({
                mensaje:
                    '¡Producto registrado con éxito!',
                id: resultado.insertId
            });
        }
    );
});

// 4. Actualizar producto
app.put('/api/productos/:codigo', (req, res) => {

    const { codigo } = req.params;

    const {
        nombre,
        categoria,
        precio,
        cantidad
    } = req.body;

    const sql = `
        UPDATE productos
        SET
            nombre = ?,
            categoria = ?,
            precio = ?,
            cantidad = ?
        WHERE codigo = ?
    `;

    db.query(
        sql,
        [
            nombre,
            categoria,
            precio,
            cantidad,
            codigo
        ],
        (err, resultado) => {

            if (err) {
                console.error(
                    'Error al actualizar producto:',
                    err
                );

                return res.status(500).json({
                    mensaje:
                        'Error al actualizar el producto'
                });
            }

            res.json({
                mensaje:
                    'Producto actualizado correctamente'
            });
        }
    );
});

// 5. Eliminar producto
app.delete('/api/productos/:codigo', (req, res) => {

    const { codigo } = req.params;

    const sql = `
        DELETE FROM productos
        WHERE codigo = ?
    `;

    db.query(sql, [codigo], (err, resultado) => {

        if (err) {
            console.error(
                'Error al eliminar producto:',
                err
            );

            return res.status(500).json({
                mensaje: 'Error al eliminar'
            });
        }

        res.json({
            mensaje:
                'Producto eliminado correctamente'
        });
    });
});

// EXPORTAR APP
module.exports = app; */

require('dotenv').config();
const express = require('express');
const path = require('path');
const ROOT_PROJECT = path.resolve(__dirname, '../../../');
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
        const [resultados] = await pool.query('SELECT * FROM productos ORDER BY id DESC');
        res.json(resultados);
    } catch (err) {
        console.error('Error al consultar productos:', err);
        res.status(500).json({ mensaje: 'Error al obtener productos' });
    }
});

// 2. Buscar producto por código
app.get('/api/productos/:codigo', async (req, res) => {
    try {
        const { codigo } = req.params;
        const [resultados] = await pool.query('SELECT * FROM productos WHERE codigo = ?', [codigo]);

        if (resultados.length === 0) {
            return res.status(404).json({ mensaje: 'Producto no encontrado' });
        }
        res.json(resultados[0]);
    } catch (err) {
        console.error('Error al buscar producto:', err);
        res.status(500).json({ mensaje: 'Error en el servidor' });
    }
});

// 3. Registrar producto
app.post('/api/productos', async (req, res) => {
    try {
        const { codigo, nombre, categoria, precio, cantidad } = req.body;
        const sql = `INSERT INTO productos (codigo, nombre, categoria, precio, cantidad) VALUES (?, ?, ?, ?, ?)`;
        const [resultado] = await pool.query(sql, [codigo, nombre, categoria, precio, cantidad]);

        res.json({ mensaje: '¡Producto registrado con éxito!', id: resultado.insertId });
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
        const sql = `UPDATE productos SET nombre = ?, categoria = ?, precio = ?, cantidad = ? WHERE codigo = ?`;

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
        await pool.query('DELETE FROM productos WHERE codigo = ?', [codigo]);
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