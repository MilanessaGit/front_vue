<template>
    <Toast />

    <div class="card">
        <!-- ENCABEZADO -->
        <div class="flex flex-column md:flex-row md:align-items-center md:justify-content-between gap-3 mb-4">
            <div>
                <h2 class="m-0">Ventas</h2>
                <p class="text-600 mt-2 mb-0">
                    Consulta las ventas registradas y su trazabilidad de inventario.
                </p>
            </div>

            <RouterLink
                to="/admin/venta/nueva"
                class="p-button p-component no-underline"
            >
                <span class="p-button-icon p-button-icon-left pi pi-plus"></span>
                <span class="p-button-label">Nueva Venta</span>
            </RouterLink>
        </div>

        <!-- FILTROS -->
        <div class="grid mb-2">
            <div class="col-12 md:col-5">
                <span class="p-input-icon-left w-full">
                    <i class="pi pi-search" />
                    <InputText
                        v-model="filtros.texto"
                        placeholder="Buscar por código o cliente"
                        class="w-full"
                    />
                </span>
            </div>

            <div class="col-12 md:col-3">
                <Dropdown
                    v-model="filtros.tipo"
                    :options="tiposVenta"
                    optionLabel="label"
                    optionValue="value"
                    placeholder="Todos los tipos"
                    showClear
                    class="w-full"
                />
            </div>

            <div class="col-12 md:col-3">
                <Dropdown
                    v-model="filtros.estado"
                    :options="estadosVenta"
                    optionLabel="label"
                    optionValue="value"
                    placeholder="Todos los estados"
                    showClear
                    class="w-full"
                />
            </div>

            <div class="col-12 md:col-1 flex align-items-center">
                <Button
                    icon="pi pi-filter-slash"
                    class="p-button-outlined w-full"
                    v-tooltip.top="'Limpiar filtros'"
                    @click="limpiarFiltros"
                />
            </div>
        </div>

        <!-- MENSAJE DE ERROR -->
        <Message
            v-if="errorCarga"
            severity="error"
            :closable="false"
            class="mb-3"
        >
            {{ errorCarga }}
        </Message>

        <!-- TABLA -->
        <DataTable
            :value="ventasFiltradas"
            :loading="cargando"
            paginator
            :rows="10"
            :rowsPerPageOptions="[5, 10, 20, 50]"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown CurrentPageReport"
            currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} ventas"
            responsiveLayout="scroll"
            stripedRows
            rowHover
            dataKey="id"
            emptyMessage="No se encontraron ventas"
            tableStyle="min-width: 70rem"
        >
            <Column field="codigo_venta" header="VENTA">
                <template #body="slotProps">
                    <span class="font-bold">
                        {{ slotProps.data.codigo_venta }}
                    </span>
                </template>
            </Column>

            <Column header="FECHA">
                <template #body="slotProps">
                    {{ formatearFecha(slotProps.data.fecha_venta) }}
                </template>
            </Column>

            <Column header="CLIENTE">
                <template #body="slotProps">
                    {{ nombreCliente(slotProps.data.cliente) }}
                </template>
            </Column>

            <Column header="TIPO">
                <template #body="slotProps">
                    <Tag
                        :value="textoTipo(slotProps.data.tipo_venta)"
                        :severity="severityTipo(slotProps.data.tipo_venta)"
                    />
                </template>
            </Column>

            <Column header="TOTAL">
                <template #body="slotProps">
                    <span class="font-semibold">
                        {{ formatearMoneda(slotProps.data.total) }}
                    </span>
                </template>
            </Column>

            <Column header="SALDO">
                <template #body="slotProps">
                    {{ formatearMoneda(slotProps.data.saldo) }}
                </template>
            </Column>

            <Column header="PAGO">
                <template #body="slotProps">
                    <Tag
                        :value="textoEstadoPago(slotProps.data)"
                        :severity="severityEstadoPago(slotProps.data)"
                    />
                </template>
            </Column>

            <Column header="ESTADO ENTREGA">
                <template #body="slotProps">
                    <Tag
                        :value="textoEstado(slotProps.data.estado)"
                        :severity="severityEstado(slotProps.data.estado)"
                    />
                </template>
            </Column>

            <Column header="ACCIONES" style="width: 8rem">
                <template #body="slotProps">
                    <Button
                        icon="pi pi-eye"
                        class="p-button-rounded p-button-text"
                        v-tooltip.top="'Ver detalle'"
                        @click="verDetalle(slotProps.data)"
                    />
                </template>
            </Column>
        </DataTable>

        <div class="flex justify-content-between align-items-center mt-3 text-600 text-sm">
            <span>
                Total filtrado: {{ ventasFiltradas.length }} venta(s).
            </span>

            <Button
                label="Actualizar"
                icon="pi pi-refresh"
                class="p-button-text"
                :loading="cargando"
                @click="getVentas"
            />
        </div>
    </div>

    <!-- DETALLE DE VENTA -->
    <Dialog
        v-model:visible="visibleDetalle"
        modal
        :header="tituloDetalle"
        :style="{ width: '75vw' }"
        :breakpoints="{ '960px': '90vw', '640px': '95vw' }"
    >
        <div v-if="ventaSeleccionada">
            <!-- DATOS GENERALES -->
            <div class="grid">
                <div class="col-12 md:col-6 lg:col-3">
                    <div class="surface-100 border-round p-3 h-full">
                        <div class="text-600 text-sm mb-2">Cliente</div>
                        <div class="font-semibold">
                            {{ nombreCliente(ventaSeleccionada.cliente) }}
                        </div>
                    </div>
                </div>

                <div class="col-12 md:col-6 lg:col-3">
                    <div class="surface-100 border-round p-3 h-full">
                        <div class="text-600 text-sm mb-2">Fecha</div>
                        <div class="font-semibold">
                            {{ formatearFecha(ventaSeleccionada.fecha_venta) }}
                        </div>
                    </div>
                </div>

                <div class="col-12 md:col-6 lg:col-3">
                    <div class="surface-100 border-round p-3 h-full">
                        <div class="text-600 text-sm mb-2">Entrega prevista</div>
                        <div class="font-semibold">
                            {{ formatearFecha(ventaSeleccionada.fecha_entrega, false) }}
                        </div>
                    </div>
                </div>

                <div class="col-12 md:col-6 lg:col-3">
                    <div class="surface-100 border-round p-3 h-full">
                        <div class="text-600 text-sm mb-2">Tipo de venta</div>
                        <Tag
                            :value="textoTipo(ventaSeleccionada.tipo_venta)"
                            :severity="severityTipo(ventaSeleccionada.tipo_venta)"
                        />
                    </div>
                </div>

                <div class="col-12 md:col-6 lg:col-3">
                    <div class="surface-100 border-round p-3 h-full">
                        <div class="text-600 text-sm mb-2">Estado de venta</div>
                        <Tag
                            :value="textoEstado(ventaSeleccionada.estado)"
                            :severity="severityEstado(ventaSeleccionada.estado)"
                        />
                    </div>
                </div>
            </div>

            <!-- RESUMEN ECONÓMICO -->
            <div class="grid mt-1">
                <div class="col-12 md:col-4">
                    <div class="border-1 surface-border border-round p-3">
                        <div class="text-600 text-sm mb-2">Total</div>
                        <div class="text-xl font-bold">
                            {{ formatearMoneda(ventaSeleccionada.total) }}
                        </div>
                    </div>
                </div>

                <div class="col-12 md:col-4">
                    <div class="border-1 surface-border border-round p-3">
                        <div class="text-600 text-sm mb-2">Adelanto</div>
                        <div class="text-xl font-bold">
                            {{ formatearMoneda(ventaSeleccionada.adelanto) }}
                        </div>
                    </div>
                </div>

                <div class="col-12 md:col-4">
                    <div class="border-1 surface-border border-round p-3">
                        <div class="text-600 text-sm mb-2">Saldo</div>
                        <div class="text-xl font-bold mb-2">
                            {{ formatearMoneda(ventaSeleccionada.saldo) }}
                        </div>
                        <Tag
                            :value="textoEstadoPago(ventaSeleccionada)"
                            :severity="severityEstadoPago(ventaSeleccionada)"
                        />
                    </div>
                </div>
            </div>

            <Divider />

            <!-- TRAZABILIDAD FIFO -->
            <div class="flex flex-column md:flex-row md:align-items-center md:justify-content-between gap-2 mb-3">
                <div>
                    <h4 class="m-0">Trazabilidad FIFO</h4>
                    <p class="text-600 mt-2 mb-0">
                        Lotes utilizados automáticamente por el sistema para esta venta.
                    </p>
                </div>

                <div class="flex gap-2 flex-wrap">
                    <Tag
                        :value="`${lotesDT.length} lote(s)`"
                        severity="info"
                    />
                    <Tag
                        :value="`${cantidadTotalVendida} unidad(es)`"
                        severity="success"
                    />
                </div>
            </div>

            <DataTable
                :value="lotesDT"
                responsiveLayout="scroll"
                stripedRows
                emptyMessage="No existen lotes asociados a esta venta"
                tableStyle="min-width: 55rem"
            >
                <Column field="codigo_lote" header="LOTE">
                    <template #body="slotProps">
                        <span class="font-semibold">
                            {{ slotProps.data.codigo_lote }}
                        </span>
                    </template>
                </Column>

                <Column header="FECHA DE INGRESO">
                    <template #body="slotProps">
                        {{ formatearFecha(slotProps.data.fecha_ingreso, false) }}
                    </template>
                </Column>

                <Column header="CANTIDAD UTILIZADA">
                    <template #body="slotProps">
                        {{ numero(slotProps.data.pivot?.cantidad) }}
                    </template>
                </Column>

                <Column header="PRECIO DE VENTA">
                    <template #body="slotProps">
                        {{ formatearMoneda(slotProps.data.pivot?.precio_unitario) }}
                    </template>
                </Column>

                <Column header="STOCK RESTANTE">
                    <template #body="slotProps">
                        {{ numero(slotProps.data.cantidad_actual) }}
                    </template>
                </Column>
            </DataTable>

            <div
                v-if="ventaSeleccionada.observaciones"
                class="surface-100 border-round p-3 mt-4"
            >
                <div class="font-semibold mb-2">Observaciones</div>
                <div class="text-700">
                    {{ ventaSeleccionada.observaciones }}
                </div>
            </div>
        </div>

        <template #footer>
            <Button
                v-if="puedeRegistrarPagoFinal"
                label="Registrar pago final"
                icon="pi pi-money-bill"
                severity="success"
                @click="abrirPagoFinal"
            />

            <Button
                v-if="puedeMarcarEntregada"
                label="Marcar como entregada"
                icon="pi pi-check-circle"
                severity="info"
                @click="abrirEntrega"
            />

            <Button
                label="Cerrar"
                icon="pi pi-times"
                class="p-button-text"
                @click="visibleDetalle = false"
            />
        </template>
    </Dialog>

    <!-- CONFIRMACIÓN DE PAGO FINAL -->
    <Dialog
        v-model:visible="visiblePagoFinal"
        modal
        header="Confirmar pago final"
        :style="{ width: '32rem' }"
        :breakpoints="{ '640px': '95vw' }"
        :closable="!pagandoSaldo"
    >
        <div v-if="ventaSeleccionada">
            <p class="mt-0 text-700">
                Se registrará el único pago final de la venta
                <strong>{{ ventaSeleccionada.codigo_venta }}</strong>.
            </p>

            <div class="surface-100 border-round p-3 mb-3">
                <div class="flex justify-content-between gap-3 mb-2">
                    <span class="text-600">Cliente</span>
                    <strong>{{ nombreCliente(ventaSeleccionada.cliente) }}</strong>
                </div>
                <div class="flex justify-content-between gap-3 mb-2">
                    <span class="text-600">Tipo</span>
                    <strong>{{ textoTipo(ventaSeleccionada.tipo_venta) }}</strong>
                </div>
                <div class="flex justify-content-between gap-3">
                    <span class="text-600">Pago final</span>
                    <strong class="text-xl">{{ formatearMoneda(montoPagoFinal) }}</strong>
                </div>
            </div>

            <Message severity="info" :closable="false">
                Esta operación dejará el saldo en Bs 0,00. No volverá a descontar inventario ni modificará los lotes FIFO utilizados.
            </Message>
        </div>

        <template #footer>
            <Button
                label="Cancelar"
                icon="pi pi-times"
                class="p-button-text"
                :disabled="pagandoSaldo"
                @click="visiblePagoFinal = false"
            />
            <Button
                label="Confirmar pago"
                icon="pi pi-check"
                severity="success"
                :loading="pagandoSaldo"
                @click="confirmarPagoFinal"
            />
        </template>
    </Dialog>

    <!-- CONFIRMACIÓN DE ENTREGA -->
    <Dialog
        v-model:visible="visibleEntrega"
        modal
        header="Confirmar entrega"
        :style="{ width: '32rem' }"
        :breakpoints="{ '640px': '95vw' }"
        :closable="!marcandoEntregada"
    >
        <div v-if="ventaSeleccionada">
            <p class="mt-0 text-700">
                La venta <strong>{{ ventaSeleccionada.codigo_venta }}</strong>
                será marcada como entregada/completada.
            </p>

            <div class="surface-100 border-round p-3 mb-3">
                <div class="flex justify-content-between gap-3 mb-2">
                    <span class="text-600">Cliente</span>
                    <strong>{{ nombreCliente(ventaSeleccionada.cliente) }}</strong>
                </div>
                <div class="flex justify-content-between gap-3 mb-2">
                    <span class="text-600">Estado de pago</span>
                    <Tag
                        :value="textoEstadoPago(ventaSeleccionada)"
                        :severity="severityEstadoPago(ventaSeleccionada)"
                    />
                </div>
                <div class="flex justify-content-between gap-3">
                    <span class="text-600">Entrega prevista</span>
                    <strong>{{ formatearFecha(ventaSeleccionada.fecha_entrega, false) }}</strong>
                </div>
            </div>

            <Message severity="info" :closable="false">
                Esta acción solo cambia el estado de la venta a Entregada/Completada. No modifica pagos, inventario ni FIFO.
            </Message>
        </div>

        <template #footer>
            <Button
                label="Cancelar"
                icon="pi pi-times"
                class="p-button-text"
                :disabled="marcandoEntregada"
                @click="visibleEntrega = false"
            />
            <Button
                label="Confirmar entrega"
                icon="pi pi-check-circle"
                severity="info"
                :loading="marcandoEntregada"
                @click="confirmarEntrega"
            />
        </template>
    </Dialog>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useToast } from 'primevue/usetoast';
import ventaService from '@/service/VentaService';


const toast = useToast();

const ventas = ref([]);
const cargando = ref(false);
const errorCarga = ref('');

const visibleDetalle = ref(false);
const visiblePagoFinal = ref(false);
const pagandoSaldo = ref(false);
const visibleEntrega = ref(false);
const marcandoEntregada = ref(false);
const ventaSeleccionada = ref(null);
const lotesDT = ref([]);

const filtros = ref({
    texto: '',
    tipo: null,
    estado: null
});

const tiposVenta = [
    { label: 'Directa', value: 'DIRECTA' },
    { label: 'Reserva', value: 'RESERVA' },
    { label: 'Contrato', value: 'CONTRATO' }
];

const estadosVenta = [
    { label: 'Pendiente de entrega', value: 1 },
    { label: 'Entregada / completada', value: 2 },
    { label: 'Cancelada', value: 3 }
];

const ventasFiltradas = computed(() => {
    const texto = filtros.value.texto.trim().toLowerCase();

    return ventas.value.filter((venta) => {
        const codigo = String(venta.codigo_venta || '').toLowerCase();
        const cliente = nombreCliente(venta.cliente).toLowerCase();
        const tipo = normalizarTipo(venta.tipo_venta);
        const estado = Number(venta.estado);

        const coincideTexto =
            !texto || codigo.includes(texto) || cliente.includes(texto);

        const coincideTipo =
            !filtros.value.tipo || tipo === filtros.value.tipo;

        const coincideEstado =
            filtros.value.estado === null ||
            filtros.value.estado === undefined ||
            estado === Number(filtros.value.estado);

        return coincideTexto && coincideTipo && coincideEstado;
    });
});

const tituloDetalle = computed(() => {
    if (!ventaSeleccionada.value) {
        return 'Detalle de venta';
    }

    return `Detalle - ${ventaSeleccionada.value.codigo_venta}`;
});

const cantidadTotalVendida = computed(() => {
    return lotesDT.value.reduce((total, lote) => {
        return total + numero(lote.pivot?.cantidad);
    }, 0);
});

const montoPagoFinal = computed(() => {
    return numero(ventaSeleccionada.value?.saldo);
});

const puedeRegistrarPagoFinal = computed(() => {
    const venta = ventaSeleccionada.value;

    if (!venta) return false;

    const tipo = normalizarTipo(venta.tipo_venta);
    const tieneSaldo = numero(venta.saldo) > 0;
    const noCancelada = Number(venta.estado) !== 3;

    return ['RESERVA', 'CONTRATO'].includes(tipo) && tieneSaldo && noCancelada;
});

const puedeMarcarEntregada = computed(() => {
    const venta = ventaSeleccionada.value;

    if (!venta) return false;

    return Number(venta.estado) === 1 && numero(venta.saldo) <= 0;
});

onMounted(() => {
    getVentas();
});

async function getVentas() {
    cargando.value = true;
    errorCarga.value = '';

    try {
        const { data } = await ventaService.listar();

        // Nuevo backend: devuelve todas las ventas como arreglo.
        // Se mantiene compatibilidad por si temporalmente responde paginado.
        ventas.value = Array.isArray(data)
            ? data
            : Array.isArray(data?.data)
                ? data.data
                : [];
    } catch (error) {
        console.error('Error al listar ventas:', error);
        ventas.value = [];
        errorCarga.value = 'No se pudo cargar la lista de ventas.';
    } finally {
        cargando.value = false;
    }
}


function limpiarFiltros() {
    filtros.value = {
        texto: '',
        tipo: null,
        estado: null
    };
}

function ordenarLotes(lotes = []) {
    return [...lotes].sort((a, b) => {
        const fechaA = new Date(normalizarFecha(a.fecha_ingreso)).getTime();
        const fechaB = new Date(normalizarFecha(b.fecha_ingreso)).getTime();

        if (fechaA === fechaB) {
            return Number(a.id) - Number(b.id);
        }

        return fechaA - fechaB;
    });
}

function verDetalle(venta) {
    ventaSeleccionada.value = venta;
    lotesDT.value = ordenarLotes(venta.lotes || []);
    visibleDetalle.value = true;
}

function abrirPagoFinal() {
    if (!puedeRegistrarPagoFinal.value) {
        return;
    }

    visiblePagoFinal.value = true;
}

async function confirmarPagoFinal() {
    if (!ventaSeleccionada.value?.id || !puedeRegistrarPagoFinal.value) {
        return;
    }

    pagandoSaldo.value = true;

    try {
        const { data } = await ventaService.modificar(
            ventaSeleccionada.value.id,
            { accion: 'PAGO_FINAL' }
        );

        const ventaActualizada = data?.data;

        if (ventaActualizada) {
            const index = ventas.value.findIndex(
                (venta) => Number(venta.id) === Number(ventaActualizada.id)
            );

            if (index !== -1) {
                ventas.value[index] = ventaActualizada;
            }

            ventaSeleccionada.value = ventaActualizada;
            lotesDT.value = ordenarLotes(ventaActualizada.lotes || []);
        } else {
            await getVentas();
        }

        visiblePagoFinal.value = false;

        toast.add({
            severity: 'success',
            summary: 'Pago registrado',
            detail: data?.mensaje || 'Pago final registrado correctamente.',
            life: 3500
        });
    } catch (error) {
        console.error('Error al registrar pago final:', error);

        const respuesta = error?.response?.data;

        toast.add({
            severity: 'error',
            summary: 'No se pudo registrar el pago',
            detail:
                respuesta?.error ||
                respuesta?.mensaje ||
                'Ocurrió un error al registrar el pago final.',
            life: 4500
        });
    } finally {
        pagandoSaldo.value = false;
    }
}

function abrirEntrega() {
    if (!puedeMarcarEntregada.value) return;
    visibleEntrega.value = true;
}

async function confirmarEntrega() {
    if (!ventaSeleccionada.value?.id || !puedeMarcarEntregada.value) {
        return;
    }

    marcandoEntregada.value = true;

    try {
        const { data } = await ventaService.modificar(
            ventaSeleccionada.value.id,
            { accion: 'MARCAR_ENTREGADA' }
        );

        const ventaActualizada = data?.data;

        if (ventaActualizada) {
            const index = ventas.value.findIndex(
                (venta) => Number(venta.id) === Number(ventaActualizada.id)
            );

            if (index !== -1) {
                ventas.value[index] = ventaActualizada;
            }

            ventaSeleccionada.value = ventaActualizada;
            lotesDT.value = ordenarLotes(ventaActualizada.lotes || []);
        } else {
            await getVentas();
        }

        visibleEntrega.value = false;

        toast.add({
            severity: 'success',
            summary: 'Entrega registrada',
            detail: data?.mensaje || 'Venta marcada como entregada correctamente.',
            life: 3500
        });
    } catch (error) {
        console.error('Error al marcar la venta como entregada:', error);

        const respuesta = error?.response?.data;

        toast.add({
            severity: 'error',
            summary: 'No se pudo completar la entrega',
            detail:
                respuesta?.error ||
                respuesta?.mensaje ||
                'Ocurrió un error al actualizar el estado de la venta.',
            life: 4500
        });
    } finally {
        marcandoEntregada.value = false;
    }
}

function textoEstadoPago(venta) {
    if (Number(venta?.estado) === 3) {
        return 'Cancelada';
    }

    return numero(venta?.saldo) > 0 ? 'Pendiente' : 'Pagado';
}

function severityEstadoPago(venta) {
    if (Number(venta?.estado) === 3) {
        return 'danger';
    }

    return numero(venta?.saldo) > 0 ? 'warning' : 'success';
}

function nombreCliente(cliente) {
    if (!cliente) {
        return 'Sin cliente';
    }

    const nombreCompleto = [cliente.nombre, cliente.apellido]
        .filter(Boolean)
        .join(' ')
        .trim();

    return nombreCompleto || cliente.ci_nit || 'Sin cliente';
}

function normalizarTipo(tipo) {
    return String(tipo || '')
        .trim()
        .toUpperCase();
}

function textoTipo(tipo) {
    const valor = normalizarTipo(tipo);

    if (valor === 'DIRECTA') return 'Directa';
    if (valor === 'RESERVA') return 'Reserva';
    if (valor === 'CONTRATO') return 'Contrato';

    return tipo || 'Sin tipo';
}

function severityTipo(tipo) {
    const valor = normalizarTipo(tipo);

    if (valor === 'DIRECTA') return 'success';
    if (valor === 'RESERVA') return 'warning';
    if (valor === 'CONTRATO') return 'info';

    return null;
}

function textoEstado(estado) {
    const valor = Number(estado);

    if (valor === 1) return 'Pendiente de entrega';
    if (valor === 2) return 'Entregada / completada';
    if (valor === 3) return 'Cancelada';

    return 'Desconocido';
}

function severityEstado(estado) {
    const valor = Number(estado);

    if (valor === 1) return 'warning';
    if (valor === 2) return 'success';
    if (valor === 3) return 'danger';

    return 'info';
}

function formatearMoneda(valor) {
    const monto = Number(valor || 0);

    return `Bs ${monto.toLocaleString('es-BO', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`;
}

function numero(valor) {
    const numeroConvertido = Number(valor || 0);
    return Number.isNaN(numeroConvertido) ? 0 : numeroConvertido;
}

function normalizarFecha(fecha) {
    if (!fecha) return '';
    return String(fecha).replace(' ', 'T');
}

function formatearFecha(fecha, incluirHora = true) {
    if (!fecha) {
        return '-';
    }

    const fechaObj = new Date(normalizarFecha(fecha));

    if (Number.isNaN(fechaObj.getTime())) {
        return fecha;
    }

    if (!incluirHora) {
        return fechaObj.toLocaleDateString('es-BO');
    }

    return fechaObj.toLocaleString('es-BO', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}
</script>
