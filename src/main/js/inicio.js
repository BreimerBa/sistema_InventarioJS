document.addEventListener("DOMContentLoaded", () => {

    cargarEstadisticas();

});


// =====================================================
// CARGAR ESTADÍSTICAS Y ÚLTIMOS PRODUCTOS
// =====================================================

async function cargarEstadisticas() {

    try {

        const respuesta = await fetch("/api/productos");


        if (!respuesta.ok) {

            throw new Error(
                "No se pudieron obtener los productos"
            );

        }


        const productos = await respuesta.json();


        console.log(
            "Productos recibidos:",
            productos
        );


        // =================================================
        // TOTAL DE PRODUCTOS
        // =================================================

        const totalProductos =
            productos.length;


        // =================================================
        // PRODUCTOS DISPONIBLES
        // =================================================

        const disponibles =
            productos.filter(producto => {

                return Number(producto.cantidad) > 0;

            }).length;


        // =================================================
        // PRODUCTOS AGOTADOS
        // =================================================

        const agotados =
            productos.filter(producto => {

                return Number(producto.cantidad) === 0;

            }).length;


        // =================================================
        // VALOR TOTAL DEL INVENTARIO
        // =================================================

        const valorTotal =
            productos.reduce(
                (total, producto) => {

                    const precio =
                        Number(producto.precio) || 0;

                    const cantidad =
                        Number(producto.cantidad) || 0;

                    return total + (precio * cantidad);

                },
                0
            );


        // =================================================
        // MOSTRAR ESTADÍSTICAS EN EL HTML
        // =================================================

        const elementoTotal =
            document.getElementById(
                "total-productos"
            );


        const elementoDisponibles =
            document.getElementById(
                "total-disponibles"
            );


        const elementoAgotados =
            document.getElementById(
                "total-agotados"
            );


        const elementoValor =
            document.getElementById(
                "valorTotalStock"
            );


        if (elementoTotal) {

            elementoTotal.textContent =
                totalProductos;

        }


        if (elementoDisponibles) {

            elementoDisponibles.textContent =
                disponibles;

        }


        if (elementoAgotados) {

            elementoAgotados.textContent =
                agotados;

        }


        if (elementoValor) {

            elementoValor.textContent =
                `$${valorTotal.toLocaleString("es-CO")}`;

        }


        // =================================================
        // MOSTRAR LOS ÚLTIMOS 3 PRODUCTOS
        // =================================================

        mostrarUltimosProductos(productos);


    } catch (error) {

        console.error(
            "Error al cargar las estadísticas:",
            error
        );

    }

}


// =====================================================
// MOSTRAR LOS ÚLTIMOS 3 PRODUCTOS
// =====================================================

function mostrarUltimosProductos(productos) {

    const contenedor =
        document.getElementById(
            "ultimos-productos"
        );


    // Si el contenedor no existe, no hacemos nada

    if (!contenedor) {

        return;

    }


    // =================================================
    // SI NO HAY PRODUCTOS
    // =================================================

    if (productos.length === 0) {

        contenedor.innerHTML = `

            <div class="col-12">

                <div class="alert alert-light border text-center">

                    <i class="bi bi-box-seam fs-2 text-muted"></i>

                    <p class="mb-0 mt-2 text-muted">
                        Todavía no hay productos registrados.
                    </p>

                </div>

            </div>

        `;

        return;

    }


    // =================================================
    // LOS PRIMEROS 3 SON LOS MÁS RECIENTES
    // =================================================

    const ultimosProductos =
        productos.slice(0, 3);


    // =================================================
    // CREAR LAS TARJETAS
    // =================================================

    contenedor.innerHTML =
        ultimosProductos.map((producto) => {

            const precio =
                Number(producto.precio) || 0;

            const cantidad =
                Number(producto.cantidad) || 0;


            return `

                <div class="col-md-4">

                    <div class="card border-0 shadow-sm h-100">

                        <div class="card-body p-4">

                            <div class="d-flex justify-content-between align-items-start">

                                <div class="icono-funcion bg-primary-subtle text-primary">

                                    <i class="bi bi-box-seam"></i>

                                </div>

                                <span class="badge bg-success-subtle text-success">

                                    <i class="bi bi-clock-history"></i>

                                    Reciente

                                </span>

                            </div>


                            <h5 class="fw-bold mt-4">

                                ${producto.nombre ?? "Sin nombre"}

                            </h5>


                            <p class="text-muted mb-2">

                                <i class="bi bi-upc"></i>

                                Código:
                                ${producto.codigo ?? "N/A"}

                            </p>


                            <p class="text-muted mb-2">

                                <i class="bi bi-tag"></i>

                                Categoría:
                                ${producto.categoria ?? "N/A"}

                            </p>


                            <p class="text-muted mb-2">

                                <i class="bi bi-boxes"></i>

                                Cantidad:
                                ${cantidad}

                            </p>


                            <p class="fw-semibold text-primary mb-0">

                                <i class="bi bi-cash"></i>

                                $${precio.toLocaleString("es-CO")}

                            </p>

                        </div>

                    </div>

                </div>

            `;

        }).join("");

}
