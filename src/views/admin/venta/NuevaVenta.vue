<template>
    <div class="venta-page">
        <Toast />

        <!-- Encabezado -->
        <div class="flex flex-column md:flex-row md:align-items-center md:justify-content-between gap-3 mb-4">
            <div>
                <div class="flex align-items-center gap-2 mb-1">
                    <i class="pi pi-shopping-cart text-primary text-2xl"></i>
                    <h2 class="m-0">Nueva Venta</h2>
                </div>
                <p class="text-600 m-0">
                    Registra productos y cantidades. El sistema seleccionará automáticamente los lotes mediante FIFO.
                </p>
            </div>

            <RouterLink
                to="/admin/venta"
                class="p-button p-component p-button-outlined no-underline"
            >
                <span class="p-button-icon p-button-icon-left pi pi-arrow-left"></span>
                <span class="p-button-label">Volver a ventas</span>
            </RouterLink>
        </div>

        <div class="grid">
            <!-- Columna principal -->
            <div class="col-12 lg:col-8">
                <!-- Datos de la venta -->
                <Card class="mb-4">
                    <template #title>
                        <div class="section-title">
                            <span class="section-icon">
                                <i class="pi pi-file-edit"></i>
                            </span>
                            <div>
                                <div>Datos de la venta</div>
                                <small class="section-subtitle">Selecciona el tipo de operación</small>
                            </div>
                        </div>
                    </template>

                    <template #content>
                        <div class="field mb-0">
                            <label class="font-semibold mb-2 block">Tipo de venta</label>
                            <Dropdown
                                v-model="tipo_venta"
                                :options="tiposVenta"
                                optionLabel="label"
                                optionValue="value"
                                placeholder="Seleccione un tipo de venta"
                                class="w-full"
                            />

                            <div v-if="tipo_venta" class="mt-3">
                                <Tag
                                    :value="tipoVentaLabel"
                                    :severity="tipoVentaSeverity"
                                    rounded
                                />
                            </div>

                            <div v-if="tipo_venta === 'DIRECTA'" class="mt-4">
                                <InlineMessage severity="success" class="w-full justify-content-start">
                                    Venta Directa: el cliente paga el total en una sola operación. Saldo final: Bs 0,00.
                                </InlineMessage>
                            </div>

                            <div v-if="tipo_venta === 'RESERVA' || tipo_venta === 'CONTRATO'" class="mt-4">
                                <label class="font-semibold mb-2 block">Adelanto inicial</label>
                                <InputNumber
                                    v-model="adelanto"
                                    :min="0"
                                    :max="Math.max(totalVenta - 0.01, 0)"
                                    :minFractionDigits="2"
                                    :maxFractionDigits="2"
                                    suffix=" Bs"
                                    class="w-full"
                                    inputClass="w-full"
                                    placeholder="Ingrese el adelanto"
                                />
                                <small class="text-600 block mt-2">
                                    Debe ser mayor a 0 y menor al total. El resto quedará como único saldo pendiente.
                                </small>
                            </div>

                            <div class="grid mt-3">
                                <div class="col-12 md:col-5">
                                    <label class="font-semibold mb-2 block">Fecha prevista de entrega</label>
                                    <InputText
                                        v-model="fecha_entrega"
                                        type="date"
                                        class="w-full"
                                    />
                                    <small class="text-600 block mt-2">Opcional. Sirve como referencia para la entrega del mueble.</small>
                                </div>

                                <div class="col-12 md:col-6 lg:col-6">
                                    <label class="font-semibold mb-2 block">Observaciones</label>
                                    <Textarea
                                        v-model="observaciones"
                                        rows="3"
                                        autoResize
                                        class="w-full"
                                        placeholder="Indicaciones de entrega, referencias u observaciones de la venta"
                                    />
                                </div>
                            </div>
                        </div>
                    </template>
                </Card>

                <!-- Cliente -->
                <Card class="mb-4">
                    <template #title>
                        <div class="section-title">
                            <span class="section-icon">
                                <i class="pi pi-user"></i>
                            </span>
                            <div>
                                <div>Cliente</div>
                                <small class="section-subtitle">Busca por CI/NIT o registra uno nuevo</small>
                            </div>
                        </div>
                    </template>

                    <template #content>
                        <div class="grid align-items-end">
                            <div class="col-12 md:col-8">
                                <label class="font-semibold mb-2 block">CI / NIT</label>
                                <span class="p-input-icon-left w-full">
                                    <i class="pi pi-search" />
                                    <InputText
                                        v-model="buscar_clie"
                                        class="w-full"
                                        placeholder="Ingrese CI/NIT y presione Enter"
                                        @keyup.enter="buscarClientes"
                                    />
                                </span>
                            </div>

                            <div class="col-12 md:col-4">
                                <div class="flex gap-2">
                                    <Button
                                        label="Buscar"
                                        icon="pi pi-search"
                                        class="flex-1"
                                        @click="buscarClientes"
                                    />
                                    <Button
                                        icon="pi pi-user-plus"
                                        severity="secondary"
                                        outlined
                                        v-tooltip.top="'Nuevo cliente'"
                                        @click="abrirNuevoCliente"
                                    />
                                </div>
                            </div>
                        </div>

                        <div v-if="cliente?.id" class="cliente-seleccionado mt-3">
                            <div class="flex align-items-start justify-content-between gap-3 flex-wrap">
                                <div class="flex align-items-center gap-3">
                                    <Avatar
                                        :label="inicialCliente"
                                        shape="circle"
                                        size="large"
                                        class="cliente-avatar"
                                    />
                                    <div>
                                        <div class="font-semibold text-lg">
                                            {{ nombreCliente }}
                                        </div>
                                        <div class="text-600 mt-1">
                                            CI/NIT: {{ cliente.ci_nit || 'Sin dato' }}
                                        </div>
                                    </div>
                                </div>
                                <Tag value="Seleccionado" severity="success" rounded />
                            </div>
                        </div>

                        <InlineMessage
                            v-else-if="clienteBuscado"
                            severity="warn"
                            class="mt-3 w-full justify-content-start"
                        >
                            Cliente no encontrado. Puedes registrarlo con el botón de nuevo cliente.
                        </InlineMessage>
                    </template>
                </Card>

                <!-- Agregar productos -->
                <Card class="mb-4">
                    <template #title>
                        <div class="section-title">
                            <span class="section-icon">
                                <i class="pi pi-box"></i>
                            </span>
                            <div>
                                <div>Agregar productos</div>
                                <small class="section-subtitle">Selecciona producto y cantidad; los lotes no se eligen manualmente</small>
                            </div>
                        </div>
                    </template>

                    <template #content>
                        <div class="grid align-items-end">
                            <div class="col-12 md:col-7">
                                <label class="font-semibold mb-2 block">Producto</label>
                                <AutoComplete
                                    v-model="productoSeleccionado"
                                    :suggestions="productosFiltrados"
                                    optionLabel="nombre"
                                    @complete="buscarProductos"
                                    forceSelection
                                    placeholder="Escriba al menos 2 caracteres"
                                    class="w-full"
                                    inputClass="w-full"
                                >
                                    <template #item="slotProps">
                                        <div class="flex justify-content-between align-items-center w-full gap-3">
                                            <div>
                                                <div class="font-semibold">{{ slotProps.item.nombre }}</div>
                                                <small class="text-600">
                                                    {{ slotProps.item.codigo_producto || 'Sin código' }}
                                                </small>
                                            </div>
                                            <div class="text-right">
                                                <div class="font-semibold">{{ formatoBs(slotProps.item.precio_sugerido) }}</div>
                                                <Tag
                                                    :value="`${Number(slotProps.item.stock || 0)} disp.`"
                                                    :severity="stockSeverity(slotProps.item.stock)"
                                                    rounded
                                                />
                                            </div>
                                        </div>
                                    </template>
                                </AutoComplete>
                            </div>

                            <div class="col-12 md:col-3 lg:col-3">
                                <label class="font-semibold mb-2 block">Cantidad</label>
                                <div class="qty-control">
                                    <Button
                                        icon="pi pi-minus"
                                        class="qty-btn p-button-outlined"
                                        :disabled="Number(cantidadSeleccionada) <= 1"
                                        @click="ajustarCantidadSeleccionada(-1)"
                                    />
                                    <InputNumber
                                        v-model="cantidadSeleccionada"
                                        :min="1"
                                        :max="maxCantidadSeleccionable"
                                        class="qty-input"
                                        inputClass="text-center"
                                    />
                                    <Button
                                        icon="pi pi-plus"
                                        class="qty-btn p-button-outlined"
                                        :disabled="Number(cantidadSeleccionada) >= Number(maxCantidadSeleccionable)"
                                        @click="ajustarCantidadSeleccionada(1)"
                                    />
                                </div>
                            </div>

                            <div class="col-12 md:col-3 lg:col-3 venta-add-btn-col">
                                <Button
                                    label="Agregar"
                                    icon="pi pi-plus"
                                    class="w-full"
                                    @click="agregarProducto"
                                />
                            </div>
                        </div>

                        <div v-if="productoSeleccionado" class="producto-info mt-3">
                            <div class="flex justify-content-between align-items-center gap-3 flex-wrap">
                                <div>
                                    <div class="font-semibold">{{ productoSeleccionado.nombre }}</div>
                                    <small class="text-600">
                                        Código: {{ productoSeleccionado.codigo_producto || 'Sin código' }}
                                    </small>
                                </div>
                                <div class="text-right">
                                    <small class="text-600 block">Precio de venta</small>
                                    <span class="font-bold text-xl">{{ formatoBs(productoSeleccionado.precio_sugerido) }}</span>
                                    <small class="text-600 block mt-2">Stock disponible</small>
                                    <span class="font-bold">{{ Number(productoSeleccionado.stock || 0) }}</span>
                                    <span class="text-600 ml-1">unid.</span>
                                </div>
                            </div>
                        </div>
                    </template>
                </Card>

                <!-- Carrito / detalle -->
                <Card>
                    <template #title>
                        <div class="section-title">
                            <span class="section-icon">
                                <i class="pi pi-list"></i>
                            </span>
                            <div>
                                <div>Productos de la venta</div>
                                <small class="section-subtitle">Detalle que será enviado al backend</small>
                            </div>
                        </div>
                    </template>

                    <template #content>
                        <DataTable
                            :value="productosVenta"
                            dataKey="producto_id"
                            responsiveLayout="scroll"
                            stripedRows
                            rowHover
                            emptyMessage="Aún no agregaste productos a la venta"
                            tableStyle="min-width: 42rem"
                        >
                            <Column header="Producto">
                                <template #body="slotProps">
                                    <div>
                                        <div class="font-semibold">{{ slotProps.data.nombre }}</div>
                                        <small class="text-600">
                                            {{ slotProps.data.codigo_producto || 'Sin código' }}
                                        </small>
                                    </div>
                                </template>
                            </Column>

                            <Column header="Cantidad" style="width: 10rem">
                                <template #body="slotProps">
                                    <div class="qty-control qty-control-table">
                                        <Button
                                            icon="pi pi-minus"
                                            class="qty-btn p-button-outlined"
                                            :disabled="Number(slotProps.data.cantidad) <= 1"
                                            @click="ajustarCantidadProducto(slotProps.data, -1)"
                                        />
                                        <InputNumber
                                            v-model="slotProps.data.cantidad"
                                            :min="1"
                                            :max="slotProps.data.stock"
                                            class="qty-input"
                                            inputClass="text-center"
                                        />
                                        <Button
                                            icon="pi pi-plus"
                                            class="qty-btn p-button-outlined"
                                            :disabled="Number(slotProps.data.cantidad) >= Number(slotProps.data.stock)"
                                            @click="ajustarCantidadProducto(slotProps.data, 1)"
                                        />
                                    </div>
                                </template>
                            </Column>

                            <Column header="Precio" style="width: 9rem">
                                <template #body="slotProps">
                                    <strong>{{ formatoBs(slotProps.data.precio_unitario) }}</strong>
                                </template>
                            </Column>

                            <Column header="Subtotal" style="width: 10rem">
                                <template #body="slotProps">
                                    <strong>{{ formatoBs(Number(slotProps.data.precio_unitario) * Number(slotProps.data.cantidad)) }}</strong>
                                </template>
                            </Column>

                            <Column header="Stock" style="width: 8rem">
                                <template #body="slotProps">
                                    <Tag
                                        :value="`${slotProps.data.stock} unid.`"
                                        :severity="stockSeverity(slotProps.data.stock)"
                                        rounded
                                    />
                                </template>
                            </Column>

                            <Column header="Acción" style="width: 6rem">
                                <template #body="slotProps">
                                    <Button
                                        icon="pi pi-trash"
                                        class="p-button-rounded p-button-danger p-button-text"
                                        v-tooltip.top="'Quitar producto'"
                                        @click="eliminarProducto(slotProps.index)"
                                    />
                                </template>
                            </Column>
                        </DataTable>
                    </template>
                </Card>
            </div>

            <!-- Resumen lateral -->
            <div class="col-12 lg:col-4">
                <div class="resumen-sticky">
                    <Card>
                        <template #title>
                            <div class="section-title">
                                <span class="section-icon">
                                    <i class="pi pi-receipt"></i>
                                </span>
                                <div>
                                    <div>Resumen</div>
                                    <small class="section-subtitle">Revisa antes de registrar</small>
                                </div>
                            </div>
                        </template>

                        <template #content>
                            <div class="summary-row">
                                <span class="text-600">Tipo</span>
                                <Tag
                                    v-if="tipo_venta"
                                    :value="tipoVentaLabel"
                                    :severity="tipoVentaSeverity"
                                    rounded
                                />
                                <span v-else class="text-500">Sin seleccionar</span>
                            </div>

                            <Divider />

                            <div class="summary-row align-items-start">
                                <span class="text-600">Cliente</span>
                                <div class="text-right max-w-12rem">
                                    <span v-if="cliente?.id" class="font-semibold">{{ nombreCliente }}</span>
                                    <span v-else class="text-500">Sin seleccionar</span>
                                </div>
                            </div>

                            <Divider />

                            <div class="summary-row">
                                <span class="text-600">Productos distintos</span>
                                <strong>{{ productosVenta.length }}</strong>
                            </div>

                            <div class="summary-row mt-3">
                                <span class="text-600">Unidades totales</span>
                                <strong class="text-xl">{{ totalUnidades }}</strong>
                            </div>

                            <Divider />

                            <div class="summary-row">
                                <span class="text-600">Total</span>
                                <strong class="text-xl">{{ formatoBs(totalVenta) }}</strong>
                            </div>

                            <div v-if="tipo_venta === 'RESERVA' || tipo_venta === 'CONTRATO'" class="summary-row mt-3">
                                <span class="text-600">Adelanto</span>
                                <strong>{{ formatoBs(adelanto) }}</strong>
                            </div>

                            <div class="summary-row mt-3">
                                <span class="text-600">Saldo</span>
                                <strong :class="saldoVenta > 0 ? 'text-orange-500' : 'text-green-600'">
                                    {{ formatoBs(saldoVenta) }}
                                </strong>
                            </div>

                            <div v-if="fecha_entrega" class="summary-row mt-3">
                                <span class="text-600">Entrega prevista</span>
                                <strong>{{ formatearFechaSimple(fecha_entrega) }}</strong>
                            </div>

                            <Divider />

                            <div class="fifo-note">
                                <div class="flex align-items-center gap-2 font-semibold mb-2">
                                    <i class="pi pi-sort-amount-down text-primary"></i>
                                    Descuento FIFO automático
                                </div>
                                <small class="text-600 line-height-3">
                                    Al confirmar, Laravel descontará primero los lotes más antiguos con stock disponible.
                                </small>
                            </div>

                            <InlineMessage
                                v-if="mensaje"
                                :severity="mensajeTipo === 'error' ? 'error' : 'success'"
                                class="mt-3 w-full justify-content-start"
                            >
                                {{ mensaje }}
                            </InlineMessage>

                            <Button
                                label="Registrar venta"
                                icon="pi pi-check-circle"
                                class="w-full mt-4"
                                size="large"
                                :disabled="!formularioListo || guardando"
                                :loading="guardando"
                                @click="abrirConfirmacion"
                            />

                            <div v-if="!formularioListo" class="text-600 text-sm mt-3 line-height-3">
                                Completa tipo de venta, cliente y al menos un producto para continuar.
                            </div>
                        </template>
                    </Card>
                </div>
            </div>
        </div>

        <!-- Dialog nuevo cliente -->
        <Dialog
            v-model:visible="visible"
            modal
            header="Nuevo Cliente"
            :style="{ width: 'min(92vw, 34rem)' }"
            class="p-fluid"
        >
            <div class="field">
                <label for="nom" class="font-semibold mb-2 block">Nombres</label>
                <InputText id="nom" v-model="clienteForm.nombre" required autofocus />
            </div>

            <div class="field">
                <label for="ap" class="font-semibold mb-2 block">Apellidos</label>
                <InputText id="ap" v-model="clienteForm.apellido" required />
            </div>

            <div class="field">
                <label for="ci" class="font-semibold mb-2 block">CI / NIT</label>
                <InputText id="ci" v-model="clienteForm.ci_nit" required />
            </div>

            <div class="field">
                <label for="tel" class="font-semibold mb-2 block">Teléfono</label>
                <InputText id="tel" v-model="clienteForm.telefono" />
            </div>

            <div class="field mb-0">
                <label for="dir" class="font-semibold mb-2 block">Dirección</label>
                <InputText id="dir" v-model="clienteForm.direccion" />
            </div>

            <template #footer>
                <Button
                    label="Cancelar"
                    icon="pi pi-times"
                    text
                    @click="visible = false"
                />
                <Button
                    label="Guardar cliente"
                    icon="pi pi-check"
                    @click="guardarCliente"
                />
            </template>
        </Dialog>

        <!-- Confirmación -->
        <Dialog
            v-model:visible="confirmacionVisible"
            modal
            header="Confirmar venta"
            :style="{ width: 'min(92vw, 32rem)' }"
        >
            <div class="confirmation-box">
                <div class="confirmation-icon">
                    <i class="pi pi-shopping-cart"></i>
                </div>

                <div>
                    <h4 class="mt-0 mb-2">¿Registrar esta venta?</h4>
                    <p class="text-600 mt-0 mb-4 line-height-3">
                        Se descontará el inventario automáticamente aplicando FIFO.
                    </p>
                </div>
            </div>

            <div class="confirmation-summary">
                <div class="summary-row">
                    <span>Cliente</span>
                    <strong>{{ nombreCliente }}</strong>
                </div>
                <div class="summary-row mt-3">
                    <span>Tipo</span>
                    <strong>{{ tipoVentaLabel }}</strong>
                </div>
                <div class="summary-row mt-3">
                    <span>Productos</span>
                    <strong>{{ productosVenta.length }}</strong>
                </div>
                <div class="summary-row mt-3">
                    <span>Unidades</span>
                    <strong>{{ totalUnidades }}</strong>
                </div>
                <div class="summary-row mt-3">
                    <span>Total</span>
                    <strong>{{ formatoBs(totalVenta) }}</strong>
                </div>
                <div v-if="tipo_venta === 'RESERVA' || tipo_venta === 'CONTRATO'" class="summary-row mt-3">
                    <span>Adelanto</span>
                    <strong>{{ formatoBs(adelanto) }}</strong>
                </div>
                <div class="summary-row mt-3">
                    <span>Saldo</span>
                    <strong>{{ formatoBs(saldoVenta) }}</strong>
                </div>
                <div v-if="fecha_entrega" class="summary-row mt-3">
                    <span>Entrega prevista</span>
                    <strong>{{ formatearFechaSimple(fecha_entrega) }}</strong>
                </div>
                <div v-if="observaciones" class="mt-3">
                    <span class="block mb-1">Observaciones</span>
                    <div class="text-700 line-height-3">{{ observaciones }}</div>
                </div>
            </div>

            <template #footer>
                <Button
                    label="Cancelar"
                    icon="pi pi-times"
                    severity="secondary"
                    text
                    :disabled="guardando"
                    @click="confirmacionVisible = false"
                />
                <Button
                    label="Confirmar venta"
                    icon="pi pi-check"
                    :loading="guardando"
                    @click="guardarVenta"
                />
            </template>
        </Dialog>
    </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useToast } from 'primevue/usetoast';

import authService from '@/service/AuthService';
import productoService from '@/service/ProductoService';
import clienteService from '@/service/ClienteService';
import ventaService from '@/service/VentaService';

const toast = useToast();

// =====================================
// Usuario autenticado
// =====================================
const mis_datos = ref(null);

// =====================================
// Tipo de venta
// =====================================
const tipo_venta = ref('');
const adelanto = ref(0);
const fecha_entrega = ref('');
const observaciones = ref('');

const tiposVenta = ref([
    { label: 'Directa', value: 'DIRECTA' },
    { label: 'Reserva', value: 'RESERVA' },
    { label: 'Contrato', value: 'CONTRATO' }
]);

// =====================================
// Productos
// =====================================
const productoSeleccionado = ref(null);
const productosFiltrados = ref([]);
const cantidadSeleccionada = ref(1);
const productosVenta = ref([]);

// =====================================
// Cliente
// =====================================
const buscar_clie = ref('');
const cliente = ref({});
const clienteBuscado = ref(false);
const clienteForm = ref({
    nombre: '',
    apellido: '',
    ci_nit: '',
    telefono: '',
    direccion: ''
});
const visible = ref(false);

// =====================================
// Estado UI
// =====================================
const guardando = ref(false);
const mensaje = ref('');
const mensajeTipo = ref('');
const confirmacionVisible = ref(false);

// =====================================
// Computed
// =====================================
const totalUnidades = computed(() =>
    productosVenta.value.reduce(
        (total, producto) => total + Number(producto.cantidad || 0),
        0
    )
);

const totalVenta = computed(() =>
    productosVenta.value.reduce(
        (total, producto) =>
            total + Number(producto.precio_unitario || 0) * Number(producto.cantidad || 0),
        0
    )
);

const saldoVenta = computed(() => {
    if (tipo_venta.value === 'DIRECTA') return 0;
    return Math.max(totalVenta.value - Number(adelanto.value || 0), 0);
});

const pagoValido = computed(() => {
    if (tipo_venta.value === 'DIRECTA') return true;

    if (tipo_venta.value === 'RESERVA' || tipo_venta.value === 'CONTRATO') {
        const monto = Number(adelanto.value || 0);
        return monto > 0 && monto < totalVenta.value;
    }

    return false;
});

const formularioListo = computed(() =>
    Boolean(
        tipo_venta.value &&
        cliente.value?.id &&
        totalVenta.value > 0 &&
        pagoValido.value &&
        productosVenta.value.length > 0 &&
        productosVenta.value.every(
            (producto) =>
                Number(producto.cantidad) > 0 &&
                Number(producto.cantidad) <= Number(producto.stock)
        )
    )
);

const tipoVentaLabel = computed(() => {
    const tipo = tiposVenta.value.find((item) => item.value === tipo_venta.value);
    return tipo?.label || '-';
});

const tipoVentaSeverity = computed(() => {
    if (tipo_venta.value === 'DIRECTA') return 'success';
    if (tipo_venta.value === 'RESERVA') return 'warning';
    if (tipo_venta.value === 'CONTRATO') return 'info';
    return 'secondary';
});

const nombreCliente = computed(() => {
    if (!cliente.value?.id) return '-';
    return `${cliente.value.nombre || ''} ${cliente.value.apellido || ''}`.trim() || 'Cliente';
});

const inicialCliente = computed(() => {
    const nombre = cliente.value?.nombre || '';
    return nombre ? nombre.charAt(0).toUpperCase() : 'C';
});

const maxCantidadSeleccionable = computed(() => {
    if (!productoSeleccionado.value) return undefined;

    const stock = Number(productoSeleccionado.value.stock || 0);
    const existente = productosVenta.value.find(
        (producto) => producto.producto_id === productoSeleccionado.value.id
    );
    const yaAgregado = Number(existente?.cantidad || 0);

    return Math.max(stock - yaAgregado, 1);
});

watch(tipo_venta, (nuevoTipo) => {
    if (nuevoTipo === 'DIRECTA') {
        adelanto.value = 0;
    }
});

onMounted(async () => {
    await perfil();
});

// =====================================
// Perfil
// =====================================
const perfil = async () => {
    try {
        const { data } = await authService.getPerfil();
        mis_datos.value = data;
    } catch (error) {
        console.error('Error al obtener el perfil:', error);
        mostrarError('No se pudo identificar al usuario actual.');
    }
};

// =====================================
// Productos
// =====================================
const buscarProductos = async (event) => {
    const texto = event.query?.trim();

    if (!texto || texto.length < 2) {
        productosFiltrados.value = [];
        return;
    }

    try {
        const { data } = await productoService.buscar(texto, 8);
        productosFiltrados.value = data?.data || [];
    } catch (error) {
        console.error('Error al buscar productos:', error);
        productosFiltrados.value = [];
    }
};

const ajustarCantidadSeleccionada = (delta) => {
    const maximo = Math.max(Number(maxCantidadSeleccionable.value || 1), 1);
    const actual = Math.max(Number(cantidadSeleccionada.value || 1), 1);
    cantidadSeleccionada.value = Math.min(Math.max(actual + delta, 1), maximo);
};

const ajustarCantidadProducto = (producto, delta) => {
    const maximo = Math.max(Number(producto?.stock || 1), 1);
    const actual = Math.max(Number(producto?.cantidad || 1), 1);
    producto.cantidad = Math.min(Math.max(actual + delta, 1), maximo);
};

const formatearFechaSimple = (fecha) => {
    if (!fecha) return '-';
    const [anio, mes, dia] = String(fecha).split('-');
    return anio && mes && dia ? `${dia}/${mes}/${anio}` : fecha;
};

const agregarProducto = () => {
    limpiarMensaje();

    if (!productoSeleccionado.value) {
        mostrarError('Seleccione un producto.');
        return;
    }

    const cantidad = Number(cantidadSeleccionada.value);
    const stock = Number(productoSeleccionado.value.stock || 0);
    const precioVenta = Number(productoSeleccionado.value.precio_sugerido || 0);

    if (precioVenta <= 0) {
        mostrarError('El producto seleccionado no tiene un precio de venta válido.');
        return;
    }

    if (!cantidad || cantidad <= 0) {
        mostrarError('La cantidad debe ser mayor a cero.');
        return;
    }

    if (stock <= 0) {
        mostrarError('El producto seleccionado no tiene stock disponible.');
        return;
    }

    const existente = productosVenta.value.find(
        (producto) => producto.producto_id === productoSeleccionado.value.id
    );

    const cantidadTotal = existente
        ? Number(existente.cantidad) + cantidad
        : cantidad;

    if (cantidadTotal > stock) {
        mostrarError(`Stock insuficiente. Disponible: ${stock} unidades.`);
        return;
    }

    if (existente) {
        existente.cantidad = cantidadTotal;
    } else {
        productosVenta.value.push({
            producto_id: productoSeleccionado.value.id,
            codigo_producto: productoSeleccionado.value.codigo_producto,
            nombre: productoSeleccionado.value.nombre,
            precio_unitario: precioVenta,
            stock,
            cantidad
        });
    }

    toast.add({
        severity: 'success',
        summary: 'Producto agregado',
        detail: `${productoSeleccionado.value.nombre} fue agregado a la venta.`,
        life: 2200
    });

    limpiarProductoSeleccionado();
};

const limpiarProductoSeleccionado = () => {
    productoSeleccionado.value = null;
    cantidadSeleccionada.value = 1;
};

const eliminarProducto = (index) => {
    const producto = productosVenta.value[index];
    productosVenta.value.splice(index, 1);

    if (producto) {
        toast.add({
            severity: 'info',
            summary: 'Producto eliminado',
            detail: producto.nombre,
            life: 1800
        });
    }
};

const formatoBs = (valor) => {
    return `Bs ${Number(valor || 0).toLocaleString('es-BO', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`;
};

const stockSeverity = (stock) => {
    const cantidad = Number(stock || 0);
    if (cantidad <= 0) return 'danger';
    if (cantidad <= 3) return 'warning';
    return 'success';
};

// =====================================
// Cliente
// =====================================
const buscarClientes = async () => {
    limpiarMensaje();
    clienteBuscado.value = false;

    if (!buscar_clie.value?.trim()) {
        mostrarError('Ingrese un CI/NIT para buscar al cliente.');
        return;
    }

    try {
        const { data } = await clienteService.buscar(buscar_clie.value.trim());
        cliente.value = data || {};
        clienteBuscado.value = true;

        if (cliente.value?.id) {
            toast.add({
                severity: 'success',
                summary: 'Cliente encontrado',
                detail: nombreCliente.value,
                life: 2200
            });
        }
    } catch (error) {
        console.error('Error al buscar cliente:', error);
        cliente.value = {};
        clienteBuscado.value = true;
        mostrarError('No se pudo buscar al cliente.');
    }
};

const abrirNuevoCliente = () => {
    clienteForm.value = {
        nombre: '',
        apellido: '',
        ci_nit: buscar_clie.value || '',
        telefono: '',
        direccion: ''
    };

    visible.value = true;
};

const guardarCliente = async () => {
    if (!clienteForm.value.nombre?.trim() || !clienteForm.value.ci_nit?.trim()) {
        mostrarError('Nombre y CI/NIT son obligatorios para registrar al cliente.');
        return;
    }

    try {
        const { data } = await clienteService.guardar(clienteForm.value);
        cliente.value = data;
        buscar_clie.value = data.ci_nit || '';
        clienteBuscado.value = true;
        visible.value = false;

        toast.add({
            severity: 'success',
            summary: 'Cliente registrado',
            detail: 'El cliente fue creado y seleccionado para la venta.',
            life: 2600
        });

        limpiarMensaje();
    } catch (error) {
        console.error('Error al guardar cliente:', error);
        mostrarError('No se pudo registrar el cliente.');
    }
};

// =====================================
// Confirmación y venta
// =====================================
const abrirConfirmacion = () => {
    limpiarMensaje();

    if (!validarFormulario()) return;

    confirmacionVisible.value = true;
};

const validarFormulario = () => {
    if (!tipo_venta.value) {
        mostrarError('Seleccione el tipo de venta.');
        return false;
    }

    if (!cliente.value?.id) {
        mostrarError('Seleccione un cliente.');
        return false;
    }

    if (productosVenta.value.length === 0) {
        mostrarError('Agregue al menos un producto a la venta.');
        return false;
    }

    if (totalVenta.value <= 0) {
        mostrarError('El total de la venta debe ser mayor a cero.');
        return false;
    }

    if (!pagoValido.value) {
        mostrarError('Para Reserva o Contrato, el adelanto debe ser mayor a 0 y menor al total.');
        return false;
    }

    const productoInvalido = productosVenta.value.find(
        (producto) =>
            Number(producto.cantidad) <= 0 ||
            Number(producto.cantidad) > Number(producto.stock)
    );

    if (productoInvalido) {
        mostrarError(`Revise la cantidad de ${productoInvalido.nombre}.`);
        return false;
    }

    if (!mis_datos.value?.user?.id) {
        mostrarError('No se pudo identificar al usuario actual.');
        return false;
    }

    return true;
};

const guardarVenta = async () => {
    limpiarMensaje();

    if (!validarFormulario()) {
        confirmacionVisible.value = false;
        return;
    }

    const datosVenta = {
        cliente_id: cliente.value.id,

        // Se mantiene exactamente el comportamiento funcional probado.
        empleado_id: mis_datos.value.user.id,

        tipo_venta: tipo_venta.value,

        // Directa no usa adelanto separado. Reserva/Contrato usan un único adelanto.
        adelanto:
            tipo_venta.value === 'DIRECTA'
                ? 0
                : Number(adelanto.value || 0),

        fecha_entrega: fecha_entrega.value || null,
        observaciones: observaciones.value?.trim() || null,

        // FIFO: Vue envía producto + cantidad. Laravel decide los lotes.
        productos: productosVenta.value.map((producto) => ({
            producto_id: producto.producto_id,
            cantidad: Number(producto.cantidad)
        }))
    };

    try {
        guardando.value = true;

        const { data } = await ventaService.guardar(datosVenta);

        confirmacionVisible.value = false;

        toast.add({
            severity: 'success',
            summary: 'Venta registrada',
            detail: data?.mensaje || 'Venta registrada correctamente aplicando FIFO.',
            life: 3500
        });

        mensaje.value = data?.mensaje || 'Venta registrada correctamente.';
        mensajeTipo.value = 'success';

        limpiarVenta();
    } catch (error) {
        console.error('Error al registrar venta:', error);

        const respuesta = error?.response?.data;

        mostrarError(
            respuesta?.error ||
            respuesta?.mensaje ||
            'No se pudo registrar la venta.'
        );
    } finally {
        guardando.value = false;
    }
};

const limpiarVenta = () => {
    productosVenta.value = [];
    productoSeleccionado.value = null;
    cantidadSeleccionada.value = 1;
    cliente.value = {};
    clienteBuscado.value = false;
    buscar_clie.value = '';
    tipo_venta.value = '';
    adelanto.value = 0;
    fecha_entrega.value = '';
    observaciones.value = '';
};

const limpiarMensaje = () => {
    mensaje.value = '';
    mensajeTipo.value = '';
};

const mostrarError = (texto) => {
    mensaje.value = texto;
    mensajeTipo.value = 'error';

    toast.add({
        severity: 'error',
        summary: 'Revisar datos',
        detail: texto,
        life: 3200
    });
};
</script>

<style scoped>
.venta-page {
    width: 100%;
}

.section-title {
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.section-icon {
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 0.75rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: var(--primary-50);
    color: var(--primary-color);
    flex-shrink: 0;
}

.section-subtitle {
    display: block;
    color: var(--text-color-secondary);
    font-weight: 400;
    margin-top: 0.2rem;
}

.cliente-seleccionado,
.producto-info,
.fifo-note,
.confirmation-summary {
    border: 1px solid var(--surface-border);
    border-radius: 0.75rem;
    padding: 1rem;
    background: var(--surface-50);
}

.cliente-avatar {
    background: var(--primary-color);
    color: var(--primary-color-text);
}

.summary-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
}

.resumen-sticky {
    position: sticky;
    top: 1rem;
}

.confirmation-box {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
}

.confirmation-icon {
    width: 3rem;
    height: 3rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: var(--primary-50);
    color: var(--primary-color);
    font-size: 1.25rem;
    flex-shrink: 0;
}

.max-w-12rem {
    max-width: 12rem;
}

:deep(.p-autocomplete) {
    width: 100%;
}

:deep(.p-autocomplete-input) {
    width: 100%;
}

.qty-control {
    width: 100%;
    min-width: 0;
    display: grid;
    grid-template-columns: 2.25rem minmax(3rem, 1fr) 2.25rem;
    align-items: stretch;
    gap: 0.35rem;
}

.qty-control-table {
    min-width: 9rem;
    max-width: 11rem;
}

.qty-btn {
    width: 2.25rem !important;
    min-width: 2.25rem !important;
    padding-left: 0 !important;
    padding-right: 0 !important;
}

.venta-add-btn-col {
    min-width: 0;
    display: flex;
    align-items: flex-end;
}

.venta-add-btn-col .p-button {
    min-height: 3rem;
}

:deep(.qty-input) {
    width: 100%;
    min-width: 0;
}

:deep(.qty-input .p-inputnumber-input) {
    width: 100%;
    min-width: 0;
    padding-left: 0.35rem;
    padding-right: 0.35rem;
}

@media screen and (max-width: 991px) {
    .resumen-sticky {
        position: static;
    }

    .venta-add-btn-col {
        padding-top: 0.25rem;
    }
}

@media screen and (max-width: 575px) {
    .summary-row {
        align-items: flex-start;
    }

    .qty-control {
        grid-template-columns: 2.35rem minmax(3rem, 1fr) 2.35rem;
        gap: 0.25rem;
    }

    .qty-btn {
        width: 2.35rem !important;
        min-width: 2.35rem !important;
    }
}
</style>
