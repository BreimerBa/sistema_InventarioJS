document.addEventListener("DOMContentLoaded", () => {

    const formulario = document.getElementById("formularioProducto");

    if (!formulario) {
        console.error("No se encontró el formulario #formularioProducto");
        return;
    }

    // ELEMENTOS DEL FORMULARIO
    // =====================================================

    const campoCodigo = document.getElementById("codigo");
    const campoNombre = document.getElementById("nombre");
    const campoCategoria = document.getElementById("categoria");
    const campoPrecio = document.getElementById("precio");
    const campoCantidad = document.getElementById("cantidad");

    const botonGuardar =
        formulario.querySelector('button[type="submit"]');


    // DETECTAR SI ESTAMOS EDITANDO
    const parametros = new URLSearchParams(
        window.location.search
    );

    const codigoEditar = parametros.get("editar");

    let modoEdicion = false;

    if (codigoEditar) {

        modoEdicion = true;

        cargarProductoParaEditar(codigoEditar);
    }

    // CARGAR PRODUCTO
    async function cargarProductoParaEditar(codigo) {

        try {

            console.log(
                "Cargando producto para editar:",
                codigo
            );

            let datos = null;
            try {
                const respuesta = await fetch(
                    `/api/productos/${encodeURIComponent(codigo)}`
                );
                if (respuesta.ok) {
                    datos = await respuesta.json();
                } else {
                    throw new Error("API no disponible");
                }
            } catch (errApi) {
                // Fallback a LocalStorage para GitHub Pages y VS Code
                const local = localStorage.getItem("inventario_productos");
                if (local) {
                    const lista = JSON.parse(local);
                    datos = lista.find(
                        p => String(p.codigo).toLowerCase() === String(codigo).toLowerCase()
                    );
                }
            }

            if (!datos) {
                throw new Error("Producto no encontrado.");
            }

            console.log(
                "Producto recibido:",
                datos
            );

            // RELLENAR FORMULARIO
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

            // BLOQUEAR CÓDIGO EN EDICIÓN Y AJUSTAR UI
            campoCodigo.readOnly = true;

            const avisoCodigo = document.getElementById("avisoCodigoEdicion");
            if (avisoCodigo) avisoCodigo.style.display = "block";

            const btnCancelar = document.getElementById("btnCancelarEdicion");
            if (btnCancelar) btnCancelar.style.display = "inline-flex";

            const tituloPag = document.getElementById("tituloPaginaRegistro");
            if (tituloPag) tituloPag.textContent = "Editar Producto";

            const descPag = document.getElementById("descPaginaRegistro");
            if (descPag) descPag.textContent = "Modifica los datos del producto seleccionado.";

            if (botonGuardar) {
                botonGuardar.innerHTML =
                    '<i class="bi bi-check-lg me-1"></i>Guardar cambios';
            }


        } catch (error) {

            console.error(
                "Error al cargar producto:",
                error
            );

            alert(
                error.message ||
                "No se pudo cargar el producto."
            );
        }
    }

    // GUARDAR / ACTUALIZAR
    formulario.addEventListener(
        "submit",
        async (evento) => {

            evento.preventDefault();

            // OBTENER DATOS
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

            // VALIDACIONES

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


            // DECIDIR POST O PUT

            // GUARDAR / ACTUALIZAR
            try {

                let guardadoEnApi = false;

                try {
                    const url = modoEdicion
                        ? `/api/productos/${encodeURIComponent(producto.codigo)}`
                        : "/api/productos";
                    const metodo = modoEdicion ? "PUT" : "POST";

                    const respuesta = await fetch(url, {
                        method: metodo,
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(producto)
                    });

                    if (respuesta.ok) {
                        guardadoEnApi = true;
                    }
                } catch (errApi) {
                }

                let lista = JSON.parse(localStorage.getItem("inventario_productos") || "[]");
                if (modoEdicion) {
                    const idx = lista.findIndex(
                        p => String(p.codigo).toLowerCase() === String(producto.codigo).toLowerCase()
                    );
                    if (idx !== -1) {
                        lista[idx] = { ...lista[idx], ...producto };
                    }
                } else {
                    const existe = lista.some(
                        p => String(p.codigo).toLowerCase() === String(producto.codigo).toLowerCase()
                    );
                    if (existe && !guardadoEnApi) {
                        alert(`Ya existe un producto con el código "${producto.codigo}".`);
                        return;
                    }
                    lista.unshift({ id: Date.now(), ...producto });
                }
                localStorage.setItem("inventario_productos", JSON.stringify(lista));

                alert(
                    modoEdicion
                        ? "Producto actualizado correctamente."
                        : "Producto registrado correctamente."
                );

                window.location.href = "./productos.html";

            } catch (error) {

                console.error(
                    "Error al guardar:",
                    error
                );

                alert(
                    error.message ||
                    "No se pudo guardar el producto."
                );
            }

        }
    );

});