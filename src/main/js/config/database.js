/* const mysql = require("mysql2/promise");

const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "inventario_web",

    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

async function probarConexion() {
    try {
        const connection = await pool.getConnection();

        console.log("¡Conectado a MySQL exitosamente!");

        connection.release();
    } catch (error) {
        console.error("Error al conectar con MySQL:", error.message);
    }
}

probarConexion();

module.exports = pool; */

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../../../.env') });

const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '1234',
    database: process.env.DB_NAME || 'inventario_web',
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool;