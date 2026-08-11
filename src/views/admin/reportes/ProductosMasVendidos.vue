<template>
    <div class="card">
        <Toast />

        <div class="flex flex-column md:flex-row md:align-items-center md:justify-content-between gap-2 mb-4">
            <div>
                <h1 class="m-0">Productos más vendidos</h1>
                <p class="text-600 mt-2 mb-0">Ranking según la cantidad de unidades vendidas.</p>
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

                <div class="col-12 md:col-3 field">
                    <label for="ranking-categoria" class="block mb-2">Categoría</label>
                    <Dropdown
                        id="ranking-categoria"
                        v-model="filtros.categoria_id"
                        :options="categorias"
                        optionLabel="nombre"
                        optionValue="id"
                        placeholder="Todas"
                        showClear
                        filter
                        class="w-full"
                    />
                </div>

                <div class="col-12 md:col-3 field" style="width: 8rem;">
                    <label for="ranking-limite" class="block mb-2">Top</label>
                    <Dropdown
                        id="ranking-limite"
                        v-model="filtros.limite"
                        :options="limites"
                        optionLabel="label"
                        optionValue="value"
                        class="w-full"
                    />
                </div>

                <div class="col-12 md:col-fixed report-filter-field">
                    <Button label="Consultar" icon="pi pi-search" class="flex-1" @click="consultar" />
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
            responsiveLayout="scroll"
            :loading="cargando"
        >
            <template #empty>No existen productos vendidos para el período seleccionado.</template>

            <Column field="posicion" header="#" class="text-center" />
            <Column field="codigo_producto" header="Código" />
            <Column field="nombre" header="Producto" />
            <Column field="categoria" header="Categoría" />
            <Column field="unidades_vendidas" header="Unidades" class="text-center" />
            <Column field="cantidad_ventas" header="Ventas" class="text-center" />
            <Column header="Total generado">
                <template #body="slotProps">
                    {{ monedaBolivianos(slotProps.data.total_generado) }}
                </template>
            </Column>
        </DataTable>
    </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from "vue";
import { useToast } from "primevue/usetoast";
import CategoriaService from "@/service/CategoriaService";
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
const categorias = ref([]);
const cargando = ref(false);

const filtros = reactive({
    fecha_inicio: periodoInicial.fechaInicio,
    fecha_fin: periodoInicial.fechaFin,
    categoria_id: null,
    limite: 10,
});

const resumen = reactive({
    producto_lider: null,
    unidades_producto_lider: 0,
    productos_con_ventas: 0,
    total_unidades_vendidas: 0,
    total_generado: 0,
});

const limites = [
    { label: "5", value: 5 },
    { label: "10", value: 10 },
    { label: "20", value: 20 },
];

const tarjetasResumen = computed(() => [
    {
        label: "Producto líder",
        value: resumen.producto_lider || "Sin datos",
        detail: `${numeroEntero(resumen.unidades_producto_lider)} unidades`,
        icon: "pi pi-star",
    },
    {
        label: "Productos con ventas",
        value: numeroEntero(resumen.productos_con_ventas),
        icon: "pi pi-box",
    },
    {
        label: "Unidades vendidas",
        value: numeroEntero(resumen.total_unidades_vendidas),
        icon: "pi pi-sort-amount-up",
    },
    {
        label: "Total generado",
        value: monedaBolivianos(resumen.total_generado),
        icon: "pi pi-money-bill",
    },
]);

function copiarObjeto(destino, origen) {
    Object.keys(destino).forEach((clave) => {
        destino[clave] = origen?.[clave] ?? destino[clave];
    });
}

async function cargarCategorias() {
    try {
        const { data } = await CategoriaService.listar();
        categorias.value = Array.isArray(data) ? data : [];
    } catch (error) {
        toast.add({
            severity: "warn",
            summary: "Categorías",
            detail: "No se pudo cargar el filtro de categorías.",
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
        const { data } = await ReporteService.productosMasVendidos(filtros);
        registros.value = data.data ?? [];
        copiarObjeto(resumen, data.resumen ?? {});
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

function limpiarFiltros() {
    const periodo = periodoMesActual();
    filtros.fecha_inicio = periodo.fechaInicio;
    filtros.fecha_fin = periodo.fechaFin;
    filtros.categoria_id = null;
    filtros.limite = 10;
    consultar();
}

onMounted(async () => {
    await cargarCategorias();
    await consultar();
});
</script>
