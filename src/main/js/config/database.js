const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../../../.env') });

const { Pool } = require('pg');

const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT) || 5432,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
    ssl: { rejectUnauthorized: false }
});

pool.on('connect', () => {
    console.log('Conexión exitosa a la base de datos PostgreSQL');
});

pool.on('error', (err) => {
    console.error('Error inesperado en el cliente de PostgreSQL:', err);
});

module.exports = pool;

/* const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../../../.env') });

const { Pool } = require('pg');

const isProduction = process.env.NODE_ENV === 'production' || process.env.DB_SSL === 'true';

const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'inventario_web',
    port: Number(process.env.DB_PORT) || 5432,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
    // SSL deshabilitado para entornos locales por defecto
    ssl: isProduction ? { rejectUnauthorized: false } : false
});

// Listener opcional para verificar conexiones activas en la consola
pool.on('connect', () => {
    console.log('Conexión exitosa a la base de datos PostgreSQL');
});

pool.on('error', (err) => {
    console.error('Error inesperado en el cliente de PostgreSQL:', err);
});

module.exports = pool; */