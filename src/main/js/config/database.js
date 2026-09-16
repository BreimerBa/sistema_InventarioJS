const mysql = require("mysql2/promise");

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

module.exports = pool;