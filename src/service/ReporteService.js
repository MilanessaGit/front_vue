import { http } from "./HttpAxios";
import { rutaRol } from "@/utils/rolRuta";

function formatearFecha(valor) {
    if (!valor) return null;

    if (typeof valor === "string") {
        return valor.substring(0, 10);
    }

    if (valor instanceof Date && !Number.isNaN(valor.getTime())) {
        const anio = valor.getFullYear();
        const mes = String(valor.getMonth() + 1).padStart(2, "0");
        const dia = String(valor.getDate()).padStart(2, "0");
        return `${anio}-${mes}-${dia}`;
    }

    return valor;
}

function prepararParametros(parametros = {}) {
    return Object.entries(parametros).reduce((resultado, [clave, valor]) => {
        if (valor === null || valor === undefined || valor === "") {
            return resultado;
        }

        if (clave === "fecha_inicio" || clave === "fecha_fin") {
            resultado[clave] = formatearFecha(valor);
        } else {
            resultado[clave] = valor;
        }

        return resultado;
    }, {});
}

export default {
    inventarioActual(parametros = {}) {
        return http().get(`${rutaRol()}/reportes/inventario-actual`, {
            params: prepararParametros(parametros),
        });
    },

    comprasPorProveedor(parametros = {}) {
        return http().get(`${rutaRol()}/reportes/compras-por-proveedor`, {
            params: prepararParametros(parametros),
        });
    },

    ventasPorPeriodo(parametros = {}) {
        return http().get(`${rutaRol()}/reportes/ventas-por-periodo`, {
            params: prepararParametros(parametros),
        });
    },

    productosMasVendidos(parametros = {}) {
        return http().get(`${rutaRol()}/reportes/productos-mas-vendidos`, {
            params: prepararParametros(parametros),
        });
    },
};
