document.addEventListener("DOMContentLoaded", () => {

    const formulario = document.getElementById("formularioProducto");

    if (!formulario) {
        console.error("No se encontró el formulario #formularioProducto");
        return;
    }

    // =====================================================
    // ELEMENTOS DEL FORMULARIO
    // =====================================================

    const campoCodigo = document.getElementById("codigo");
    const campoNombre = document.getElementById("nombre");
    const campoCategoria = document.getElementById("categoria");
    const campoPrecio = document.getElementById("precio");
    const campoCantidad = document.getElementById("cantidad");

    const botonGuardar =
        formulario.querySelector('button[type="submit"]');


    // =====================================================
    // DETECTAR SI ESTAMOS EDITANDO
    // =====================================================

    const parametros = new URLSearchParams(
        window.location.search
    );

    const codigoEditar = parametros.get("editar");

    let modoEdicion = false;


    if (codigoEditar) {

        modoEdicion = true;

        cargarProductoParaEditar(codigoEditar);
    }


    // =====================================================
    // CARGAR PRODUCTO
    // =====================================================

    async function cargarProductoParaEditar(codigo) {

        try {

            console.log(
                "Cargando producto para editar:",
                codigo
            );

            const respuesta = await fetch(
                `/api/productos/${encodeURIComponent(codigo)}`
            );


            const datos = await respuesta.json();


            if (!respuesta.ok) {

                throw new Error(
                    datos.error ||
                    "No se pudo obtener el producto"
                );
            }


            console.log(
                "Producto recibido:",
                datos
            );


            // ==========================================
            // RELLENAR FORMULARIO
            // ==========================================

            campoCodigo.value =
                datos.codigo || "";

            campoNombre.value =
                datos.nombre || "";

            campoCategoria.value =
                datos.categoria || "";

            campoPrecio.value =
                datos.precio ?? "";

            campoCantidad.value =
                datos.cantidad ?? "";


            // ==========================================
            // BLOQUEAR CÓDIGO EN EDICIÓN
            // ==========================================

            campoCodigo.readOnly = true;


            // Cambiar texto del botón
            if (botonGuardar) {

                botonGuardar.innerHTML =
                    "Guardar cambios";
            }


        } catch (error) {

            console.error(
                "Error al cargar producto:",
                error
            );

            alert(
                "No se pudo cargar el producto."
            );
        }
    }


    // =====================================================
    // GUARDAR / ACTUALIZAR
    // =====================================================

    formulario.addEventListener(
        "submit",
        async (evento) => {

            evento.preventDefault();


            // ==========================================
            // OBTENER DATOS
            // ==========================================

            const producto = {

                codigo:
                    campoCodigo.value.trim(),

                nombre:
                    campoNombre.value.trim(),

                categoria:
                    campoCategoria.value,

                precio:
                    Number(campoPrecio.value),

                cantidad:
                    Number(campoCantidad.value)

            };


            // ==========================================
            // VALIDACIONES
            // ==========================================

            if (!producto.codigo) {

                alert(
                    "El código es obligatorio."
                );

                return;
            }


            if (!producto.nombre) {

                alert(
                    "El nombre es obligatorio."
                );

                return;
            }


            if (!producto.categoria) {

                alert(
                    "Selecciona una categoría."
                );

                return;
            }


            if (
                Number.isNaN(producto.precio) ||
                producto.precio < 0
            ) {

                alert(
                    "Ingresa un precio válido."
                );

                return;
            }


            if (
                Number.isNaN(producto.cantidad) ||
                producto.cantidad < 0
            ) {

                alert(
                    "Ingresa una cantidad válida."
                );

                return;
            }


            // ==========================================
            // DECIDIR POST O PUT
            // ==========================================

            const url = modoEdicion

                ? `/api/productos/${encodeURIComponent(
                    producto.codigo
                )}`

                : "/api/productos";


            const metodo =
                modoEdicion
                    ? "PUT"
                    : "POST";


            // ==========================================
            // ENVIAR AL SERVIDOR
            // ==========================================

            try {

                console.log(
                    `${metodo} ${url}`,
                    producto
                );


                const respuesta = await fetch(
                    url,
                    {
                        method: metodo,

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(producto)
                    }
                );


                const datos =
                    await respuesta.json()
                        .catch(() => ({}));


                // ======================================
                // ERROR
                // ======================================

                if (!respuesta.ok) {

                    console.error(
                        "Error del servidor:",
                        datos
                    );

                    alert(
                        datos.error ||
                        datos.mensaje ||
                        "No se pudo guardar el producto."
                    );

                    return;
                }


                // ======================================
                // ÉXITO
                // ======================================

                console.log(
                    "Respuesta:",
                    datos
                );


                alert(
                    datos.mensaje ||
                    (
                        modoEdicion
                            ? "Producto actualizado correctamente."
                            : "Producto registrado correctamente."
                    )
                );


                // Volver a productos
                window.location.href =
                    "/productos";


            } catch (error) {

                console.error(
                    "Error de conexión:",
                    error
                );

                alert(
                    "No se pudo conectar con el servidor."
                );
            }

        }
    );

});