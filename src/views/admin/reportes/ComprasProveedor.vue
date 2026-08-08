<template>
    <div class="card">
        <Toast />

        <div class="flex flex-column md:flex-row md:align-items-center md:justify-content-between gap-2 mb-4">
            <div>
                <h1 class="m-0">Compras por proveedor</h1>
                <p class="text-600 mt-2 mb-0">Compras, pagos y saldos pendientes agrupados por proveedor.</p>
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
                    <label for="compras-proveedor" class="block mb-2">Proveedor</label>
                    <Dropdown
                        id="compras-proveedor"
                        v-model="filtros.proveedor_id"
                        :options="proveedores"
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
            dataKey="proveedor_id"
            lazy
            paginator
            responsiveLayout="scroll"
            :rows="filtros.per_page"
            :first="primerRegistro"
            :totalRecords="meta.total"
            :rowsPerPageOptions="[5, 10, 20, 50]"
            :loading="cargando"
            currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} proveedores"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown CurrentPageReport"
            @page="cambiarPagina"
        >
            <template #empty>No existen compras para el período seleccionado.</template>

            <Column field="codigo_proveedor" header="Código" />
            <Column field="proveedor" header="Proveedor" />
            <Column field="cantidad_compras" header="Compras" class="text-center" />
            <Column field="unidades_compradas" header="Unidades" class="text-center" />
            <Column header="Total comprado">
                <template #body="slotProps">
                    {{ monedaBolivianos(slotProps.data.total_comprado) }}
                </template>
            </Column>
            <Column header="Total pagado">
                <template #body="slotProps">
                    {{ monedaBolivianos(slotProps.data.total_pagado) }}
                </template>
            </Column>
            <Column header="Saldo pendiente">
                <template #body="slotProps">
                    <Tag
                        :value="monedaBolivianos(slotProps.data.saldo_pendiente)"
                        :severity="Number(slotProps.data.saldo_pendiente) > 0 ? 'warning' : 'success'"
                    />
                </template>
            </Column>
        </DataTable>
    </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from "vue";
import { useToast } from "primevue/usetoast";
import ProveedorService from "@/service/ProveedorService";
import ReporteService from "@/service/ReporteService";
import FiltroPeriodo from "@/components/reportes/FiltroPeriodo.vue";
import ResumenReporte from "@/components/reportes/ResumenReporte.vue";
import {
    mensajeDeError,
    monedaBolivianos,
    numeroEntero,
    periodoMesActual,
    periodoValido,
} from "@/utils/reportes";

const toast = useToast();
const periodoInicial = periodoMesActual();
const registros = ref([]);
const proveedores = ref([]);
const cargando = ref(false);

const filtros = reactive({
    fecha_inicio: periodoInicial.fechaInicio,
    fecha_fin: periodoInicial.fechaFin,
    proveedor_id: null,
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
    proveedores_involucrados: 0,
    cantidad_compras: 0,
    unidades_compradas: 0,
    total_comprado: 0,
    total_pagado: 0,
    saldo_pendiente: 0,
});

const primerRegistro = computed(() => (meta.pagina_actual - 1) * meta.por_pagina);

const tarjetasResumen = computed(() => [
    {
        label: "Proveedores",
        value: numeroEntero(resumen.proveedores_involucrados),
        icon: "pi pi-users",
    },
    {
        label: "Compras / unidades",
        value: `${numeroEntero(resumen.cantidad_compras)} / ${numeroEntero(resumen.unidades_compradas)}`,
        icon: "pi pi-shopping-cart",
    },
    {
        label: "Total comprado",
        value: monedaBolivianos(resumen.total_comprado),
        detail: `Pagado: ${monedaBolivianos(resumen.total_pagado)}`,
        icon: "pi pi-money-bill",
    },
    {
        label: "Saldo pendiente",
        value: monedaBolivianos(resumen.saldo_pendiente),
        icon: "pi pi-clock",
    },
]);

function copiarObjeto(destino, origen) {
    Object.keys(destino).forEach((clave) => {
        destino[clave] = origen?.[clave] ?? destino[clave];
    });
}

async function cargarProveedores() {
    try {
        const acumulados = [];
        let paginaCero = 0;
        let ultimaPagina = 1;

        do {
            const { data } = await ProveedorService.listar({
                lazyEvent: JSON.stringify({ page: paginaCero, rows: 50 }),
            });

            acumulados.push(...(data.data ?? []));
            ultimaPagina = Number(data.last_page ?? 1);
            paginaCero += 1;
        } while (paginaCero < ultimaPagina);

        proveedores.value = acumulados.map((proveedor) => ({
            ...proveedor,
            etiqueta: [proveedor.codigo_proveedor, proveedor.nombre, proveedor.apellido]
                .filter(Boolean)
                .join(" - "),
        }));
    } catch (error) {
        toast.add({
            severity: "warn",
            summary: "Proveedores",
            detail: "No se pudo cargar el filtro de proveedores.",
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
        const { data } = await ReporteService.comprasPorProveedor(filtros);
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
    filtros.proveedor_id = null;
    filtros.per_page = 10;
    filtros.page = 1;
    consultar();
}

function cambiarPagina(evento) {
    filtros.page = evento.page + 1;
    filtros.per_page = evento.rows;
    consultar();
}

onMounted(async () => {
    await cargarProveedores();
    await consultar();
});
</script>
