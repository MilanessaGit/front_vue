<template>
    <div class="card">
        <Toast />

        <div class="flex flex-column md:flex-row md:align-items-center md:justify-content-between gap-2 mb-4">
            <div>
                <h1 class="m-0">Inventario actual</h1>
                <p class="text-600 mt-2 mb-0">Existencias consolidadas desde los lotes activos.</p>
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
                <div class="col-12 md:col-4 field">
                    <label for="inventario-buscar" class="block mb-2">Producto</label>
                    <span class="p-input-icon-left w-full">
                        <i class="pi pi-search" />
                        <InputText
                            id="inventario-buscar"
                            v-model.trim="filtros.buscar"
                            class="w-full"
                            placeholder="Código o nombre"
                            @keyup.enter="aplicarFiltros"
                        />
                    </span>
                </div>

                <div class="col-12 md:col-3 field">
                    <label for="inventario-categoria" class="block mb-2">Categoría</label>
                    <Dropdown
                        id="inventario-categoria"
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

                <div class="col-12 md:col-3 field">
                    <label for="inventario-estado" class="block mb-2">Estado del stock</label>
                    <Dropdown
                        id="inventario-estado"
                        v-model="filtros.estado"
                        :options="estadosStock"
                        optionLabel="label"
                        optionValue="value"
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
            currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} productos"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown CurrentPageReport"
            @page="cambiarPagina"
        >
            <template #empty>No existen productos para los filtros seleccionados.</template>

            <Column field="codigo_producto" header="Código" />
            <Column field="nombre" header="Producto" />
            <Column field="categoria" header="Categoría" />
            <Column field="lotes_con_stock" header="Lotes" class="text-center" />
            <Column field="stock_actual" header="Stock actual" class="text-center" />
            <Column field="stock_minimo" header="Stock mínimo" class="text-center" />
            <Column header="Estado">
                <template #body="slotProps">
                    <Tag
                        :value="textoEstado(slotProps.data.estado_stock)"
                        :severity="severidadEstado(slotProps.data.estado_stock)"
                    />
                </template>
            </Column>
            <Column header="Valor del inventario">
                <template #body="slotProps">
                    {{ monedaBolivianos(slotProps.data.valor_inventario) }}
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
import ResumenReporte from "@/components/reportes/ResumenReporte.vue";
import {
    mensajeDeError,
    monedaBolivianos,
    numeroEntero,
} from "@/utils/reportes";

const toast = useToast();
const registros = ref([]);
const categorias = ref([]);
const cargando = ref(false);

const filtros = reactive({
    buscar: "",
    categoria_id: null,
    estado: "todos",
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
    productos_registrados: 0,
    productos_disponibles: 0,
    productos_stock_bajo: 0,
    productos_sin_stock: 0,
    total_unidades: 0,
    valor_inventario: 0,
});

const estadosStock = [
    { label: "Todos", value: "todos" },
    { label: "Disponible", value: "disponible" },
    { label: "Stock bajo", value: "bajo" },
    { label: "Sin stock", value: "sin_stock" },
];

const primerRegistro = computed(() => (meta.pagina_actual - 1) * meta.por_pagina);

const tarjetasResumen = computed(() => [
    {
        label: "Productos consultados",
        value: numeroEntero(resumen.productos_registrados),
        icon: "pi pi-box",
    },
    {
        label: "Disponibles",
        value: numeroEntero(resumen.productos_disponibles),
        detail: `${numeroEntero(resumen.total_unidades)} unidades en total`,
        icon: "pi pi-check-circle",
    },
    {
        label: "Stock bajo / sin stock",
        value: `${numeroEntero(resumen.productos_stock_bajo)} / ${numeroEntero(resumen.productos_sin_stock)}`,
        icon: "pi pi-exclamation-triangle",
    },
    {
        label: "Valor del inventario",
        value: monedaBolivianos(resumen.valor_inventario),
        icon: "pi pi-wallet",
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

async function consultar() {
    cargando.value = true;

    try {
        const { data } = await ReporteService.inventarioActual(filtros);
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
    filtros.buscar = "";
    filtros.categoria_id = null;
    filtros.estado = "todos";
    filtros.per_page = 10;
    filtros.page = 1;
    consultar();
}

function cambiarPagina(evento) {
    filtros.page = evento.page + 1;
    filtros.per_page = evento.rows;
    consultar();
}

function textoEstado(estado) {
    return {
        disponible: "Disponible",
        bajo: "Stock bajo",
        sin_stock: "Sin stock",
    }[estado] ?? "Desconocido";
}

function severidadEstado(estado) {
    return {
        disponible: "success",
        bajo: "warning",
        sin_stock: "danger",
    }[estado] ?? "info";
}

onMounted(async () => {
    await cargarCategorias();
    await consultar();
});
</script>
