<template>
    <div class="grid">
        <!-- DATOS DE VENTA -->
        <div class="col-12">
            <Card>
                <template #title>DATOS DE VENTA</template>
                <template #content>
                    <div>
                        <label class="font-bold mb-2 block">Tipo de venta</label>
                        <Dropdown
                            v-model="tipo_venta"
                            :options="tiposVenta"
                            optionLabel="label"
                            optionValue="value"
                            placeholder="Seleccione un tipo"
                            class="w-full"
                        />
                    </div>
                </template>
            </Card>
        </div>

        <!-- PRODUCTOS -->
        <div class="col-12 md:col-7">
            <Card>
                <template #title>PRODUCTOS</template>
                <template #content>
                    <div class="grid align-items-end">
                        <div class="col-12 md:col-7">
                            <label class="font-bold mb-2 block">Producto</label>
                            <AutoComplete
                                v-model="productoSeleccionado"
                                :suggestions="productosFiltrados"
                                optionLabel="nombre"
                                @complete="buscarProductos"
                                forceSelection
                                placeholder="Escriba el nombre del producto"
                                class="w-full"
                            />
                        </div>

                        <div class="col-12 md:col-2">
                            <label class="font-bold mb-2 block">Cantidad</label>
                            <InputNumber
                                v-model="cantidadSeleccionada"
                                :min="1"
                                class="w-full"
                            />
                        </div>

                        <div class="col-12 md:col-3">
                            <Button
                                label="Agregar"
                                icon="pi pi-plus"
                                class="w-full"
                                @click="agregarProducto"
                            />
                        </div>
                    </div>

                    <div v-if="productoSeleccionado" class="mt-3">
                        <strong>Stock disponible:</strong>
                        {{ productoSeleccionado.stock }} unidades
                    </div>
                </template>
            </Card>
        </div>

        <!-- DETALLE + CLIENTE + GUARDAR -->
        <div class="col-12 md:col-5">
            <div class="grid">
                <div class="col-12">
                    <div class="card">
                        <h5>DETALLE DE VENTA</h5>

                        <DataTable
                            :value="productosVenta"
                            responsiveLayout="scroll"
                            stripedRows
                            emptyMessage="No hay productos agregados"
                        >
                            <Column field="codigo_producto" header="COD"></Column>
                            <Column field="nombre" header="PRODUCTO"></Column>
                            <Column field="cantidad" header="CANT"></Column>
                            <Column field="stock" header="STOCK"></Column>

                            <Column header="ACCIÓN">
                                <template #body="slotProps">
                                    <Button
                                        icon="pi pi-trash"
                                        class="p-button-rounded p-button-danger p-button-text"
                                        @click="eliminarProducto(slotProps.index)"
                                    />
                                </template>
                            </Column>
                        </DataTable>
                    </div>
                </div>

                <!-- CLIENTE -->
                <div class="col-12">
                    <div class="card">
                        <h5>CLIENTE</h5>

                        <span class="p-input-icon-left">
                            <i class="pi pi-search" />

                            <InputText
                                v-model="buscar_clie"
                                placeholder="Buscar por CI/NIT"
                                @keypress.enter="buscarClientes"
                            />
                        </span>

                        <Button
                            label="Nuevo"
                            icon="pi pi-external-link"
                            class="ml-2"
                            @click="abrirNuevoCliente"
                        />

                        <div v-if="cliente?.id" class="mt-3">
                            <h4>
                                CLIENTE:
                                {{ cliente.nombre }}
                                {{ cliente.apellido }}
                            </h4>

                            <h4>
                                CI/NIT:
                                {{ cliente.ci_nit }}
                            </h4>
                        </div>

                        <div v-else class="mt-3">
                            CLIENTE NO ENCONTRADO
                        </div>
                    </div>
                </div>

                <!-- MENSAJES -->
                <div class="col-12" v-if="mensaje">
                    <div
                        class="card"
                        :class="
                            mensajeTipo === 'error'
                                ? 'text-red-500'
                                : 'text-green-600'
                        "
                    >
                        {{ mensaje }}
                    </div>
                </div>

                <!-- GUARDAR -->
                <div class="col-12">
                    <div class="card">
                        <Button
                            label="Guardar Venta"
                            icon="pi pi-check"
                            :loading="guardando"
                            :disabled="guardando"
                            @click="guardarVenta"
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- NUEVO CLIENTE -->
    <Dialog
        v-model:visible="visible"
        modal
        header="Nuevo Cliente"
        :style="{ width: '50vw' }"
        class="p-fluid"
    >
        <div class="field">
            <label for="nom">Ingrese Nombres</label>

            <InputText
                type="text"
                id="nom"
                v-model="clienteForm.nombre"
                required
                autofocus
            />
        </div>

        <div class="field">
            <label for="ap">Ingrese Apellidos</label>

            <InputText
                type="text"
                id="ap"
                v-model="clienteForm.apellido"
                required
            />
        </div>

        <div class="field">
            <label for="ci">Ingrese CI/NIT</label>

            <InputText
                type="text"
                id="ci"
                v-model="clienteForm.ci_nit"
                required
            />
        </div>

        <div class="field">
            <label for="tel">TELÉFONO</label>

            <InputText
                type="text"
                id="tel"
                v-model="clienteForm.telefono"
            />
        </div>

        <div class="field">
            <label for="dir">DIRECCIÓN</label>

            <InputText
                type="text"
                id="dir"
                v-model="clienteForm.direccion"
            />
        </div>

        <template #footer>
            <Button
                label="Cancelar"
                icon="pi pi-times"
                class="p-button-text"
                @click="visible = false"
            />

            <Button
                label="Guardar"
                icon="pi pi-check"
                class="p-button-text"
                @click="guardarCliente"
            />
        </template>
    </Dialog>
</template>

<script setup>
import { onMounted, ref } from 'vue';

import authService from '@/service/AuthService';
import productoService from '@/service/ProductoService';
import clienteService from '@/service/ClienteService';
import ventaService from '@/service/VentaService';

import Column from 'primevue/column';

// =====================================
// Datos del usuario autenticado
// =====================================

const mis_datos = ref(null);

// =====================================
// Tipo de venta
// =====================================

const tipo_venta = ref('');

const tiposVenta = ref([
    {
        label: 'Directa',
        value: 'DIRECTA'
    },
    {
        label: 'Reserva',
        value: 'RESERVA'
    },
    {
        label: 'Contrato',
        value: 'CONTRATO'
    }
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

const clienteForm = ref({
    nombre: '',
    apellido: '',
    ci_nit: '',
    telefono: '',
    direccion: ''
});

const visible = ref(false);

// =====================================
// Estado del formulario
// =====================================

const guardando = ref(false);

const mensaje = ref('');

const mensajeTipo = ref('');

// =====================================
// ON MOUNTED
// =====================================

onMounted(async () => {
    await perfil();
});

// =====================================
// PERFIL
// =====================================

const perfil = async () => {
    try {
        const { data } = await authService.getPerfil();

        mis_datos.value = data;
    } catch (error) {
        console.error(
            'Error al obtener el perfil:',
            error
        );
    }
};

// =====================================
// BUSCAR PRODUCTOS
// =====================================

const buscarProductos = async (event) => {
    const texto = event.query;

    if (!texto || texto.length < 2) {
        productosFiltrados.value = [];

        return;
    }

    try {
        const { data } =
            await productoService.buscar(
                texto,
                5
            );

        productosFiltrados.value =
            data.data;
    } catch (error) {
        console.error(
            'Error al buscar productos:',
            error
        );

        productosFiltrados.value = [];
    }
};

// =====================================
// AGREGAR PRODUCTO
// =====================================

const agregarProducto = () => {
    mensaje.value = '';

    if (!productoSeleccionado.value) {
        mostrarError(
            'Seleccione un producto.'
        );

        return;
    }

    const cantidad =
        Number(
            cantidadSeleccionada.value
        );

    const stock =
        Number(
            productoSeleccionado.value.stock ?? 0
        );

    if (!cantidad || cantidad <= 0) {
        mostrarError(
            'La cantidad debe ser mayor a cero.'
        );

        return;
    }

    const existente =
        productosVenta.value.find(
            (producto) =>
                producto.producto_id ===
                productoSeleccionado.value.id
        );

    const cantidadTotal =
        existente
            ? Number(existente.cantidad) +
              cantidad
            : cantidad;

    if (cantidadTotal > stock) {
        mostrarError(
            `Stock insuficiente. Disponible: ${stock} unidades.`
        );

        return;
    }

    if (existente) {
        existente.cantidad =
            cantidadTotal;
    } else {
        productosVenta.value.push({
            producto_id:
                productoSeleccionado.value.id,

            codigo_producto:
                productoSeleccionado.value
                    .codigo_producto,

            nombre:
                productoSeleccionado.value
                    .nombre,

            stock:
                stock,

            cantidad:
                cantidad
        });
    }

    limpiarProductoSeleccionado();
};

// =====================================
// LIMPIAR PRODUCTO
// =====================================

const limpiarProductoSeleccionado = () => {
    productoSeleccionado.value = null;

    cantidadSeleccionada.value = 1;
};

// =====================================
// ELIMINAR PRODUCTO
// =====================================

const eliminarProducto = (index) => {
    productosVenta.value.splice(
        index,
        1
    );
};

// =====================================
// BUSCAR CLIENTE
// =====================================

const buscarClientes = async () => {
    mensaje.value = '';

    if (!buscar_clie.value) {
        mostrarError(
            'Ingrese un CI/NIT para buscar al cliente.'
        );

        return;
    }

    try {
        const { data } =
            await clienteService.buscar(
                buscar_clie.value
            );

        cliente.value =
            data || {};
    } catch (error) {
        console.error(
            'Error al buscar cliente:',
            error
        );

        cliente.value = {};

        mostrarError(
            'No se pudo buscar al cliente.'
        );
    }
};

// =====================================
// ABRIR NUEVO CLIENTE
// =====================================

const abrirNuevoCliente = () => {
    clienteForm.value = {
        nombre: '',
        apellido: '',

        ci_nit:
            buscar_clie.value || '',

        telefono: '',
        direccion: ''
    };

    visible.value = true;
};

// =====================================
// GUARDAR CLIENTE
// =====================================

const guardarCliente = async () => {
    try {
        const { data } =
            await clienteService.guardar(
                clienteForm.value
            );

        cliente.value = data;

        buscar_clie.value =
            data.ci_nit || '';

        visible.value = false;

        mensaje.value =
            'Cliente registrado correctamente.';

        mensajeTipo.value =
            'success';
    } catch (error) {
        console.error(
            'Error al guardar cliente:',
            error
        );

        mostrarError(
            'No se pudo registrar el cliente.'
        );
    }
};

// =====================================
// GUARDAR VENTA
// =====================================

const guardarVenta = async () => {
    mensaje.value = '';

    if (!tipo_venta.value) {
        mostrarError(
            'Seleccione el tipo de venta.'
        );

        return;
    }

    if (!cliente.value?.id) {
        mostrarError(
            'Seleccione un cliente.'
        );

        return;
    }

    if (
        productosVenta.value.length === 0
    ) {
        mostrarError(
            'Agregue al menos un producto a la venta.'
        );

        return;
    }

    if (!mis_datos.value?.user?.id) {
        mostrarError(
            'No se pudo identificar al usuario actual.'
        );

        return;
    }

    const datosVenta = {
        cliente_id:
            cliente.value.id,

        /*
         * Se mantiene el comportamiento
         * actual del proyecto.
         *
         * Si users.id y empleados.id
         * no coinciden, revisaremos
         * únicamente este campo.
         */
        empleado_id:
            mis_datos.value.user.id,

        tipo_venta:
            tipo_venta.value,

        /*
         * PAYLOAD PARA FIFO
         *
         * Vue solamente envía:
         *
         * producto_id
         * cantidad
         *
         * Laravel selecciona
         * automáticamente los lotes.
         */
        productos:
            productosVenta.value.map(
                (producto) => ({
                    producto_id:
                        producto.producto_id,

                    cantidad:
                        producto.cantidad
                })
            )
    };

    try {
        guardando.value = true;

        console.log(
            'Datos de venta enviados:',
            datosVenta
        );

        const { data } =
            await ventaService.guardar(
                datosVenta
            );

        mensaje.value =
            data.mensaje ||
            'Venta registrada correctamente.';

        mensajeTipo.value =
            'success';

        limpiarVenta();
    } catch (error) {
        console.error(
            'Error al registrar venta:',
            error
        );

        const respuesta =
            error?.response?.data;

        mostrarError(
            respuesta?.error ||
                respuesta?.mensaje ||
                'No se pudo registrar la venta.'
        );
    } finally {
        guardando.value = false;
    }
};

// =====================================
// LIMPIAR VENTA
// =====================================

const limpiarVenta = () => {
    productosVenta.value = [];

    productoSeleccionado.value = null;

    cantidadSeleccionada.value = 1;

    cliente.value = {};

    buscar_clie.value = '';

    tipo_venta.value = '';
};

// =====================================
// MOSTRAR ERROR
// =====================================

const mostrarError = (texto) => {
    mensaje.value = texto;

    mensajeTipo.value = 'error';
};
</script>