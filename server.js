//Conexion a la base de datos, puesto 3000

const app = require("./src/main/js/app");

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
