const CATEGORIAS_FORMATO = {
    tecnologia: "Tecnología",
    papeleria: "Papelería",
    accesorios: "Accesorios",
    otros: "Otros"
};

let productosMemoria = [];

const tablaProductos = document.getElementById("tablaProductos");
const buscadorInput = document.getElementById("buscadorProductos");
const filtroCategoriaSelect = document.getElementById("filtroCategoria");


// ========================================
// INICIALIZACIÓN
// ========================================

document.addEventListener("DOMContentLoaded", function () {

    if (tablaProductos) {
        cargarProductosDesdeServidor();
    }

    if (buscadorInput) {
        buscadorInput.addEventListener("input", aplicarFiltros);
    }

    if (filtroCategoriaSelect) {
        filtroCategoriaSelect.addEventListener("change", aplicarFiltros);
    }
});


// ========================================
// OBTENER PRODUCTOS
// ========================================

async function cargarProductosDesdeServidor() {

    try {

        try {
            const respuesta = await fetch("/api/productos");
            if (respuesta.ok) {
                productosMemoria = await respuesta.json();
                localStorage.setItem("inventario_productos", JSON.stringify(productosMemoria));
            } else {
                throw new Error("API no disponible");
            }
        } catch (errApi) {
            // Fallback a LocalStorage para GitHub Pages y VS Code
            const local = localStorage.getItem("inventario_productos");
            if (local) {
                productosMemoria = JSON.parse(local);
            } else {
                productosMemoria = [
                    { id: 1, codigo: "P001", nombre: "Teclado", categoria: "tecnologia", precio: 12000, cantidad: 5 }
                ];
                localStorage.setItem("inventario_productos", JSON.stringify(productosMemoria));
            }
        }

        renderizarTabla(productosMemoria);

        actualizarEstadisticas(productosMemoria);

    } catch (error) {

        console.error(
            "Error al obtener los productos:",
            error
        );

        if (tablaProductos) {

            tablaProductos.innerHTML = `
                <tr>
                    <td colspan="6"
                        class="text-center py-4 text-danger">

                        <i class="bi bi-exclamation-triangle fs-4 d-block mb-2"></i>

                        No se pudieron cargar los productos.
                        Asegúrate de que el servidor esté activo.

                    </td>
                </tr>
            `;
        }
    }
}


// ========================================
// BUSCAR Y FILTRAR
// ========================================

function aplicarFiltros() {

    const termino = buscadorInput
        ? buscadorInput.value.trim().toLowerCase()
        : "";

    const categoriaFiltro = filtroCategoriaSelect
        ? filtroCategoriaSelect.value
        : "";


    const filtrados = productosMemoria.filter(function (producto) {

        const codigo = String(producto.codigo || "").toLowerCase();
        const nombre = String(producto.nombre || "").toLowerCase();

        const coincideTermino =
            codigo.includes(termino) ||
            nombre.includes(termino);

        const coincideCategoria =
            !categoriaFiltro ||
            producto.categoria === categoriaFiltro;

        return coincideTermino && coincideCategoria;
    });


    renderizarTabla(filtrados);

    actualizarValorTotalStock(filtrados);
}


// ========================================
// RENDERIZAR TABLA
// ========================================

function renderizarTabla(lista) {

    if (!tablaProductos) {
        return;
    }

    tablaProductos.innerHTML = "";


    if (!lista || lista.length === 0) {

        tablaProductos.innerHTML = `
            <tr>
                <td colspan="6"
                    class="text-center py-5 text-muted">

                    <i class="bi bi-inbox fs-2 d-block mb-2 text-secondary"></i>

                    No se encontraron productos registrados.

                </td>
            </tr>
        `;

        return;
    }


    lista.forEach(function (producto) {

        const fila = document.createElement("tr");


        const categoriaTexto =
            CATEGORIAS_FORMATO[producto.categoria]
            || producto.categoria;


        const precioFormateado =
            Number(producto.precio || 0)
                .toLocaleString("es-CO");


        const cantidad =
            Number(producto.cantidad || 0);


        const cantidadBadge =
            cantidad === 0

                ? `<span class="badge bg-danger">
                       0 (Agotado)
                   </span>`

                : `<span class="fw-semibold">
                       ${cantidad}
                   </span>`;


        fila.innerHTML = `
            <td>
                <code>${producto.codigo}</code>
            </td>

            <td class="fw-semibold">
                ${producto.nombre}
            </td>

            <td>
                <span class="badge bg-light text-dark border px-2 py-1">
                    ${categoriaTexto}
                </span>
            </td>

            <td>
                $${precioFormateado}
            </td>

            <td>
                ${cantidadBadge}
            </td>

            <td class="text-center">

                <button
                    class="btn btn-warning btn-sm me-2 btn-editar"
                    data-codigo="${producto.codigo}">

                    <i class="bi bi-pencil-square me-1"></i>
                    Editar

                </button>


                <button
                    class="btn btn-danger btn-sm btn-eliminar"
                    data-codigo="${producto.codigo}">

                    <i class="bi bi-trash me-1"></i>
                    Eliminar

                </button>

            </td>
        `;


        tablaProductos.appendChild(fila);
    });
}


// ========================================
// BOTONES DE LA TABLA
// ========================================

document.addEventListener("click", async function (evento) {

    const btnEliminar =
        evento.target.closest(".btn-eliminar");

    const btnEditar =
        evento.target.closest(".btn-editar");


    // ------------------------------------
    // ELIMINAR
    // ------------------------------------

    if (btnEliminar) {

        const codigo =
            btnEliminar.dataset.codigo;


        const confirmar = confirm(
            `¿Estás seguro de que deseas eliminar ` +
            `el producto con código "${codigo}"?`
        );


        if (!confirmar) {
            return;
        }


        try {

            try {
                const respuesta = await fetch(
                    `/api/productos/${encodeURIComponent(codigo)}`,
                    { method: "DELETE" }
                );
                if (respuesta.ok) {
                    const data = await respuesta.json().catch(() => ({}));
                    alert(data.mensaje || "Producto eliminado correctamente.");
                } else {
                    throw new Error("API no disponible");
                }
            } catch (errApi) {
                // Fallback a LocalStorage para GitHub Pages y VS Code
                productosMemoria = productosMemoria.filter(
                    p => String(p.codigo).toLowerCase() !== String(codigo).toLowerCase()
                );
                localStorage.setItem("inventario_productos", JSON.stringify(productosMemoria));
                alert("Producto eliminado correctamente.");
            }

            cargarProductosDesdeServidor();

        } catch (error) {

            console.error(
                "Error al eliminar:",
                error
            );

            alert(
                error.message ||
                "Error al intentar eliminar el producto."
            );
        }
    }


    // ------------------------------------
    // EDITAR
    // ------------------------------------

    if (btnEditar) {

        const codigo =
            btnEditar.dataset.codigo;


        window.location.href =
            `./registro.html?editar=${encodeURIComponent(codigo)}`;
    }

});


// ========================================
// ESTADÍSTICAS
// ========================================

function actualizarEstadisticas(productosArray) {

    if (!productosArray) {
        return;
    }


    const totalProductos =
        productosArray.length;


    const disponibles =
        productosArray.filter(function (producto) {

            return Number(producto.cantidad) > 0;

        }).length;


    const agotados =
        productosArray.filter(function (producto) {

            return Number(producto.cantidad) === 0;

        }).length;


    const elTotal =
        document.getElementById("total-productos");


    const elDisponibles =
        document.getElementById("total-disponibles");


    const elAgotados =
        document.getElementById("total-agotados");


    if (elTotal) {
        elTotal.textContent = totalProductos;
    }


    if (elDisponibles) {
        elDisponibles.textContent = disponibles;
    }


    if (elAgotados) {
        elAgotados.textContent = agotados;
    }


    actualizarValorTotalStock(productosArray);
}


// ========================================
// VALOR TOTAL DEL INVENTARIO
// ========================================

function actualizarValorTotalStock(productosArray) {

    if (!productosArray) {
        return;
    }


    const valorTotal =
        productosArray.reduce(
            function (total, producto) {

                const precio =
                    Number(producto.precio) || 0;

                const cantidad =
                    Number(producto.cantidad) || 0;

                return total + (precio * cantidad);

            },
            0
        );


    const elemento =
        document.getElementById("valorTotalStock");


    if (elemento) {

        elemento.textContent =
            `$${valorTotal.toLocaleString("es-CO")}`;
    }
}
