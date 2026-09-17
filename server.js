/* //Conexion a la base de datos, puesto 3000

const app = require("./src/main/js/app");

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
 */

require('dotenv').config();
const app = require('./src/main/js/app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});