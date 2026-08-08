<template>
    <div class="card">
        <Toast />

        <div class="flex flex-column md:flex-row md:align-items-center md:justify-content-between gap-2 mb-4">
            <div>
                <h1 class="m-0">Ventas por período</h1>
                <p class="text-600 mt-2 mb-0">Detalle de ventas vigentes dentro del rango seleccionado.</p>
            </div>
            <Button
                label="Actualizar"
                icon="pi pi-refresh"
                class="p-button-outlined"
                :loading="cargando"
                @click="consultar"
            />
        </div>

        <div class="surface-100 border-round p-3 mb-4">
            <div class="grid align-items-end">
                <FiltroPeriodo
                    v-model:fechaInicio="filtros.fecha_inicio"
                    v-model:fechaFin="filtros.fecha_fin"
                    :disabled="cargando"
                />

                <div class="col-12 md:col-4 field">
                    <label for="ventas-cliente" class="block mb-2">Cliente</label>
                    <Dropdown
                        id="ventas-cliente"
                        v-model="filtros.cliente_id"
                        :options="clientes"
                        optionLabel="etiqueta"
                        optionValue="id"
                        placeholder="Todos"
                        showClear
                        filter
                        class="w-full"
                    />
                </div>

                <div class="col-12 md:col-2 flex gap-2">
                    <Button label="Consultar" icon="pi pi-search" class="flex-1" @click="aplicarFiltros" />
                    <Button
                        icon="pi pi-filter-slash"
                        class="p-button-secondary p-button-outlined"
                        aria-label="Limpiar filtros"
                        v-tooltip.top="'Limpiar filtros'"
                        @click="limpiarFiltros"
                    />
                </div>
            </div>
        </div>

        <ResumenReporte :items="tarjetasResumen" class="mb-3" />

        <DataTable
            :value="registros"
            dataKey="id"
            lazy
            paginator
            responsiveLayout="scroll"
            :rows="filtros.per_page"
            :first="primerRegistro"
            :totalRecords="meta.total"
            :rowsPerPageOptions="[5, 10, 20, 50]"
            :loading="cargando"
            currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} ventas"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown CurrentPageReport"
            @page="cambiarPagina"
        >
            <template #empty>No existen ventas para el período seleccionado.</template>

            <Column field="codigo_venta" header="Código" />
            <Column header="Fecha">
                <template #body="slotProps">
                    {{ fechaLegible(slotProps.data.fecha_venta) }}
                </template>
            </Column>
            <Column field="tipo_venta" header="Tipo" />
            <Column field="cliente" header="Cliente" />
            <Column field="responsable" header="Responsable" />
            <Column field="unidades_vendidas" header="Unidades" class="text-center" />
            <Column header="Total">
                <template #body="slotProps">
                    {{ monedaBolivianos(slotProps.data.total) }}
                </template>
            </Column>
            <Column header="Estado">
                <template #body="slotProps">
                    <Tag
                        :value="slotProps.data.estado_texto"
                        :severity="severidadVenta(slotProps.data.estado)"
                    />
                </template>
            </Column>
        </DataTable>
    </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from "vue";
import { useToast } from "primevue/usetoast";
import ClienteService from "@/service/ClienteService";
import ReporteService from "@/service/ReporteService";
import FiltroPeriodo from "@/components/reportes/FiltroPeriodo.vue";
import ResumenReporte from "@/components/reportes/ResumenReporte.vue";
import {
    fechaLegible,
    mensajeDeError,
    monedaBolivianos,
    numeroEntero,
    periodoMesActual,
    periodoValido,
} from "@/utils/reportes";

const toast = useToast();
const periodoInicial = periodoMesActual();
const registros = ref([]);
const clientes = ref([]);
const cargando = ref(false);

const filtros = reactive({
    fecha_inicio: periodoInicial.fechaInicio,
    fecha_fin: periodoInicial.fechaFin,
    cliente_id: null,
    per_page: 10,
    page: 1,
});

const meta = reactive({
    pagina_actual: 1,
    ultima_pagina: 1,
    por_pagina: 10,
    total: 0,
    desde: null,
    hasta: null,
});

const resumen = reactive({
    cantidad_ventas: 0,
    unidades_vendidas: 0,
    total_vendido: 0,
    promedio_venta: 0,
});

const primerRegistro = computed(() => (meta.pagina_actual - 1) * meta.por_pagina);

const tarjetasResumen = computed(() => [
    {
        label: "Ventas registradas",
        value: numeroEntero(resumen.cantidad_ventas),
        icon: "pi pi-shopping-bag",
    },
    {
        label: "Unidades vendidas",
        value: numeroEntero(resumen.unidades_vendidas),
        icon: "pi pi-box",
    },
    {
        label: "Total vendido",
        value: monedaBolivianos(resumen.total_vendido),
        icon: "pi pi-money-bill",
    },
    {
        label: "Promedio por venta",
        value: monedaBolivianos(resumen.promedio_venta),
        icon: "pi pi-chart-line",
    },
]);

function copiarObjeto(destino, origen) {
    Object.keys(destino).forEach((clave) => {
        destino[clave] = origen?.[clave] ?? destino[clave];
    });
}

async function cargarClientes() {
    try {
        const acumulados = [];
        let paginaCero = 0;
        let ultimaPagina = 1;

        do {
            const { data } = await ClienteService.listar({
                lazyEvent: JSON.stringify({ page: paginaCero, rows: 50 }),
            });

            acumulados.push(...(data.data ?? []));
            ultimaPagina = Number(data.last_page ?? 1);
            paginaCero += 1;
        } while (paginaCero < ultimaPagina);

        clientes.value = acumulados.map((cliente) => ({
            ...cliente,
            etiqueta: [cliente.ci_nit, cliente.nombre, cliente.apellido]
                .filter(Boolean)
                .join(" - "),
        }));
    } catch (error) {
        toast.add({
            severity: "warn",
            summary: "Clientes",
            detail: "No se pudo cargar el filtro de clientes.",
            life: 3500,
        });
    }
}

function validarPeriodo() {
    if (!periodoValido(filtros.fecha_inicio, filtros.fecha_fin)) {
        toast.add({
            severity: "warn",
            summary: "Período inválido",
            detail: "La fecha inicial debe ser menor o igual a la fecha final.",
            life: 4000,
        });
        return false;
    }

    return true;
}

async function consultar() {
    if (!validarPeriodo()) return;

    cargando.value = true;

    try {
        const { data } = await ReporteService.ventasPorPeriodo(filtros);
        registros.value = data.data ?? [];
        copiarObjeto(resumen, data.resumen ?? {});
        copiarObjeto(meta, data.meta ?? {});
    } catch (error) {
        registros.value = [];
        toast.add({
            severity: "error",
            summary: "Error",
            detail: mensajeDeError(error),
            life: 5000,
        });
    } finally {
        cargando.value = false;
    }
}

function aplicarFiltros() {
    filtros.page = 1;
    consultar();
}

function limpiarFiltros() {
    const periodo = periodoMesActual();
    filtros.fecha_inicio = periodo.fechaInicio;
    filtros.fecha_fin = periodo.fechaFin;
    filtros.cliente_id = null;
    filtros.per_page = 10;
    filtros.page = 1;
    consultar();
}

function cambiarPagina(evento) {
    filtros.page = evento.page + 1;
    filtros.per_page = evento.rows;
    consultar();
}

function severidadVenta(estado) {
    return Number(estado) === 2 ? "success" : "warning";
}

onMounted(async () => {
    await cargarClientes();
    await consultar();
});
</script>
