export function periodoMesActual() {
    const hoy = new Date();

    return {
        fechaInicio: new Date(hoy.getFullYear(), hoy.getMonth(), 1),
        fechaFin: new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0),
    };
}

export function monedaBolivianos(valor) {
    const numero = Number(valor ?? 0);
    return `Bs ${numero.toLocaleString("es-BO", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;
}

export function numeroEntero(valor) {
    return Number(valor ?? 0).toLocaleString("es-BO", {
        maximumFractionDigits: 0,
    });
}

export function fechaLegible(valor) {
    if (!valor) return "—";

    const fechaTexto = String(valor).substring(0, 10);
    const [anio, mes, dia] = fechaTexto.split("-").map(Number);

    if (!anio || !mes || !dia) return valor;

    return new Date(anio, mes - 1, dia).toLocaleDateString("es-BO");
}

export function mensajeDeError(error, mensajePredeterminado = "No fue posible obtener el reporte.") {
    const errores = error?.response?.data?.errors;

    if (errores) {
        const primerGrupo = Object.values(errores)[0];
        if (Array.isArray(primerGrupo) && primerGrupo.length > 0) {
            return primerGrupo[0];
        }
    }

    return error?.response?.data?.message || mensajePredeterminado;
}

export function periodoValido(fechaInicio, fechaFin) {
    return fechaInicio instanceof Date
        && fechaFin instanceof Date
        && !Number.isNaN(fechaInicio.getTime())
        && !Number.isNaN(fechaFin.getTime())
        && fechaInicio <= fechaFin;
}
