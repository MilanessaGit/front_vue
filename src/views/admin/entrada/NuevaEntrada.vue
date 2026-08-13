<template>
    <div class="grid entrada-page">
        <Toast />

        <!-- Encabezado -->
        <div class="col-12">
            <Card class="entrada-header-card">
                <template #content>
                    <div class="entrada-header">
                        <div class="entrada-title-wrap">
                            <div class="entrada-icon">
                                <i class="pi pi-download"></i>
                            </div>
                            <div>
                                <h2>Registrar entrada</h2>
                                <p>Registra productos recibidos y genera sus lotes de inventario.</p>
                            </div>
                        </div>
                        <div class="entrada-date">
                            <i class="pi pi-calendar"></i>
                            <span>{{ fechaActual }}</span>
                        </div>
                    </div>
                </template>
            </Card>
        </div>

        <!-- Datos generales -->
        <div class="col-12">
            <Card>
                <template #title>
                    <div class="section-title">
                        <i class="pi pi-file-edit"></i>
                        <span>Datos de entrada</span>
                    </div>
                </template>

                <template #content>
                    <div class="formgrid grid">
                        <div class="field col-12 md:col-4">
                            <label for="proveedor" class="field-label">Proveedor *</label>
                            <Dropdown
                                id="proveedor"
                                v-model="selectedProv"
                                :options="proovs"
                                optionLabel="nombre"
                                optionValue="id"
                                placeholder="Seleccione un proveedor"
                                class="w-full"
                                filter
                            />
                        </div>

                        <div class="field col-12 md:col-4">
                            <label for="tipoEntrada" class="field-label">Tipo de entrada *</label>
                            <Dropdown
                                id="tipoEntrada"
                                v-model="selectedType"
                                :options="tipos"
                                optionLabel="nombre"
                                placeholder="Seleccione un tipo"
                                class="w-full"
                            />
                        </div>

                        <div class="field col-12 md:col-4">
                            <label for="fechaEntrada" class="field-label">Fecha</label>
                            <InputText
                                id="fechaEntrada"
                                v-model="fechaActual"
                                class="w-full"
                                readonly
                            />
                            <small class="field-help">Fecha generada automáticamente.</small>
                        </div>
                    </div>
                </template>
            </Card>
        </div>

        <!-- Agregar producto -->
        <div class="col-12">
            <Card>
                <template #title>
                    <div class="section-title">
                        <i class="pi pi-box"></i>
                        <span>Detalle del producto</span>
                    </div>
                </template>

                <template #content>
                    <div class="formgrid grid align-items-end">
                        <div class="field col-12 md:col-5">
                            <label for="producto" class="field-label">Producto *</label>
                            <Dropdown
                                id="producto"
                                v-model="selectedProd"
                                :options="products"
                                optionLabel="nombre"
                                optionValue="codigo_producto"
                                placeholder="Seleccione un producto"
                                :virtualScrollerOptions="{ itemSize: 38 }"
                                class="w-full"
                                filter
                            />
                        </div>

                        <div class="field col-12 md:col-2">
                            <label for="cantidad" class="field-label">Cantidad *</label>
                            <InputNumber
                                id="cantidad"
                                v-model="cant"
                                :min="1"
                                :useGrouping="false"
                                class="w-full"
                                inputClass="w-full"
                            />
                        </div>

                        <div class="field col-12 md:col-3">
                            <label for="costo" class="field-label">Costo unitario *</label>
                            <InputNumber
                                id="costo"
                                v-model="precio"
                                mode="currency"
                                currency="BOB"
                                locale="es-BO"
                                :min="0"
                                class="w-full"
                                inputClass="w-full"
                            />
                        </div>

                        <div class="field col-12 md:col-2">
                            <Button
                                label="Agregar"
                                icon="pi pi-plus"
                                class="w-full"
                                @click="addEntrada"
                            />
                        </div>
                    </div>

                    <div class="entrada-note">
                        <i class="pi pi-info-circle"></i>
                        <span>Cada producto agregado generará su lote al registrar la entrada.</span>
                    </div>
                </template>
            </Card>
        </div>

        <!-- Productos agregados -->
        <div class="col-12">
            <Card>
                <template #title>
                    <div class="section-title section-title-between">
                        <div class="flex align-items-center gap-2">
                            <i class="pi pi-list"></i>
                            <span>Productos agregados</span>
                        </div>
                        <Tag
                            :value="`${detalleEntrada.length} producto${detalleEntrada.length === 1 ? '' : 's'}`"
                            severity="info"
                        />
                    </div>
                </template>

                <template #content>
                    <DataTable
                        :value="detalleEntrada"
                        responsiveLayout="scroll"
                        class="entrada-table"
                        :rowHover="true"
                    >
                        <Column field="codigo_producto" header="Producto"></Column>

                        <Column field="cantidad" header="Cantidad">
                            <template #body="slotProps">
                                <span class="font-semibold">{{ slotProps.data.cantidad }}</span>
                            </template>
                        </Column>

                        <Column field="costo_unitario" header="Costo unitario">
                            <template #body="slotProps">
                                {{ formatCurrency(slotProps.data.costo_unitario) }}
                            </template>
                        </Column>

                        <Column header="Subtotal">
                            <template #body="slotProps">
                                <span class="font-semibold">
                                    {{ formatCurrency(slotProps.data.cantidad * slotProps.data.costo_unitario) }}
                                </span>
                            </template>
                        </Column>

                        <Column header="Acción" style="width: 7rem">
                            <template #body="slotProps">
                                <Button
                                    icon="pi pi-trash"
                                    class="p-button-rounded p-button-text p-button-danger"
                                    aria-label="Quitar producto"
                                    v-tooltip.top="'Quitar producto'"
                                    @click="eliminarDetalle(slotProps.index)"
                                />
                            </template>
                        </Column>

                        <template #empty>
                            <div class="empty-detail">
                                <i class="pi pi-inbox"></i>
                                <span>Aún no agregaste productos a esta entrada.</span>
                            </div>
                        </template>
                    </DataTable>

                    <div class="entrada-footer">
                        <div class="total-box">
                            <span>Total de la entrada</span>
                            <strong>{{ formatCurrency(totalEntrada) }}</strong>
                        </div>

                        <Button
                            label="Guardar entrada"
                            icon="pi pi-check"
                            :loading="guardando"
                            :disabled="guardando || detalleEntrada.length === 0"
                            @click="guardarEntrada"
                        />
                    </div>
                </template>
            </Card>
        </div>
    </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useToast } from 'primevue/usetoast';

import authService from '@/service/AuthService';
import productoService from '@/service/ProductoService';
import proveedorService from '@/service/ProveedorService';
import entradaService from '@/service/EntradaService';

const toast = useToast();

const mis_datos = ref(null);
const detalleEntrada = ref([]);
const selectedProv = ref(null);
const proovs = ref([]);
const fechaActual = ref(new Date().toISOString().slice(0, 10));
const cant = ref(1);
const precio = ref(0);
const products = ref([]);
const selectedProd = ref(null);
const selectedType = ref(null);
const guardando = ref(false);

const tipos = ref([
    { id: 1, nombre: 'Compra' },
    { id: 2, nombre: 'Produccion Propia' },
    { id: 3, nombre: 'Devolucion Cliente' },
    { id: 4, nombre: 'Ajuste Positivo' }
]);

const totalEntrada = computed(() => {
    return detalleEntrada.value.reduce((total, item) => {
        return total + (Number(item.cantidad) * Number(item.costo_unitario));
    }, 0);
});

onMounted(async () => {
    fechaActual.value = new Date().toISOString().split('T')[0];

    await Promise.all([
        cargarProveedores(),
        cargarProductos(),
        perfil()
    ]);
});

const perfil = async () => {
    try {
        const { data } = await authService.getPerfil();
        mis_datos.value = data;
    } catch (error) {
        console.error('Error al obtener el perfil:', error);
    }
};

const cargarProveedores = async () => {
    try {
        const params = {
            lazyEvent: JSON.stringify({
                page: 0,
                rows: 100
            })
        };

        const { data } = await proveedorService.listar(params);
        proovs.value = data?.data || [];
    } catch (error) {
        console.error('Error al cargar proveedores:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudieron cargar los proveedores.',
            life: 3500
        });
    }
};

const cargarProductos = async () => {
    try {
        const { data } = await productoService.listar();
        products.value = data?.data || [];
    } catch (error) {
        console.error('Error al cargar productos:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudieron cargar los productos.',
            life: 3500
        });
    }
};

const addEntrada = () => {
    if (!selectedProd.value) {
        toast.add({
            severity: 'warn',
            summary: 'Producto requerido',
            detail: 'Seleccione un producto antes de agregarlo.',
            life: 3000
        });
        return;
    }

    if (!cant.value || Number(cant.value) < 1) {
        toast.add({
            severity: 'warn',
            summary: 'Cantidad inválida',
            detail: 'La cantidad debe ser mayor a cero.',
            life: 3000
        });
        return;
    }

    if (precio.value === null || Number(precio.value) < 0) {
        toast.add({
            severity: 'warn',
            summary: 'Costo inválido',
            detail: 'Ingrese un costo unitario válido.',
            life: 3000
        });
        return;
    }

    const existe = detalleEntrada.value.find(
        (item) => item.codigo_producto === selectedProd.value
    );

    if (existe) {
        toast.add({
            severity: 'warn',
            summary: 'Producto duplicado',
            detail: 'Este producto ya fue agregado a la entrada.',
            life: 3000
        });
        return;
    }

    detalleEntrada.value.push({
        codigo_producto: selectedProd.value,
        cantidad: Number(cant.value),
        costo_unitario: Number(precio.value)
    });

    selectedProd.value = null;
    cant.value = 1;
    precio.value = 0;
};

const eliminarDetalle = (index) => {
    detalleEntrada.value.splice(index, 1);
};

const guardarEntrada = async () => {
    if (!selectedProv.value) {
        toast.add({
            severity: 'warn',
            summary: 'Proveedor requerido',
            detail: 'Seleccione el proveedor de la entrada.',
            life: 3000
        });
        return;
    }

    if (!selectedType.value) {
        toast.add({
            severity: 'warn',
            summary: 'Tipo requerido',
            detail: 'Seleccione el tipo de entrada.',
            life: 3000
        });
        return;
    }

    if (detalleEntrada.value.length === 0) {
        toast.add({
            severity: 'warn',
            summary: 'Sin productos',
            detail: 'Agregue al menos un producto antes de guardar.',
            life: 3000
        });
        return;
    }

    if (!mis_datos.value?.user?.id) {
        toast.add({
            severity: 'error',
            summary: 'Usuario no identificado',
            detail: 'No fue posible identificar al usuario que registra la entrada.',
            life: 4000
        });
        return;
    }

    guardando.value = true;

    try {
        const datos_ent = {
            proveedor_id: selectedProv.value,
            empleado_id: mis_datos.value.user.id,
            tipo_entrada: selectedType.value.nombre,
            productos: detalleEntrada.value
        };

        const { data } = await entradaService.guardar(datos_ent);

        toast.add({
            severity: 'success',
            summary: 'Entrada registrada',
            detail: 'La entrada se registró correctamente.',
            life: 4000
        });

        limpiarFormulario();
    } catch (error) {
        console.error('Error al registrar la entrada:', error);

        const mensaje = error.response?.data?.mensaje
            || error.response?.data?.message
            || 'No se pudo registrar la entrada.';

        toast.add({
            severity: 'error',
            summary: 'No se pudo registrar',
            detail: mensaje,
            life: 4500
        });
    } finally {
        guardando.value = false;
    }
};

const limpiarFormulario = () => {
    selectedProv.value = null;
    selectedType.value = null;
    selectedProd.value = null;
    cant.value = 1;
    precio.value = 0;
    detalleEntrada.value = [];
    fechaActual.value = new Date().toISOString().split('T')[0];
};

const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-BO', {
        style: 'currency',
        currency: 'BOB',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(Number(value || 0));
};
</script>

<style scoped>
.entrada-page {
    width: 100%;
}

.entrada-header-card {
    overflow: hidden;
}

.entrada-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
}

.entrada-title-wrap {
    display: flex;
    align-items: center;
    gap: 0.9rem;
}

.entrada-icon {
    width: 3rem;
    height: 3rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 12px;
    background: var(--primary-50);
    color: var(--primary-color);
    flex: 0 0 auto;
}

.entrada-icon i {
    font-size: 1.35rem;
}

.entrada-header h2 {
    margin: 0;
    font-size: 1.45rem;
    color: var(--text-color);
}

.entrada-header p {
    margin: 0.25rem 0 0;
    color: var(--text-color-secondary);
    font-size: 0.92rem;
}

.entrada-date {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.65rem 0.85rem;
    border-radius: 9px;
    background: var(--surface-ground);
    color: var(--text-color-secondary);
    white-space: nowrap;
}

.section-title {
    display: flex;
    align-items: center;
    gap: 0.55rem;
    font-size: 1.05rem;
}

.section-title i {
    color: var(--primary-color);
}

.section-title-between {
    justify-content: space-between;
    width: 100%;
}

.field-label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
    color: var(--text-color);
}

.field-help {
    display: block;
    margin-top: 0.4rem;
    color: var(--text-color-secondary);
    font-size: 0.82rem;
}

.entrada-note {
    display: flex;
    align-items: center;
    gap: 0.55rem;
    margin-top: 0.4rem;
    padding: 0.7rem 0.8rem;
    border-radius: 8px;
    background: var(--surface-ground);
    color: var(--text-color-secondary);
    font-size: 0.88rem;
}

.entrada-note i {
    color: var(--primary-color);
}

.empty-detail {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.65rem;
    padding: 2rem 1rem;
    color: var(--text-color-secondary);
}

.empty-detail i {
    font-size: 1.8rem;
}

.entrada-footer {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 1rem;
    margin-top: 1.25rem;
    padding-top: 1rem;
    border-top: 1px solid var(--surface-border);
}

.total-box {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.total-box span {
    color: var(--text-color-secondary);
    font-size: 0.86rem;
}

.total-box strong {
    color: var(--text-color);
    font-size: 1.35rem;
}

@media (max-width: 767px) {
    .entrada-header,
    .entrada-footer {
        align-items: stretch;
        flex-direction: column;
    }

    .entrada-date {
        width: fit-content;
    }

    .entrada-footer :deep(.p-button) {
        width: 100%;
    }
}
</style>
