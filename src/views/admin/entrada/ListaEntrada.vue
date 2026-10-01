<template>
  <!--{{ salidas }}-->
  <div class="card">
    <h1>Lista de Entradas</h1>
    <DataTable :value="entradas" responsiveLayout="scroll"
                scrollable
                stripedRows
                tableStyle="min-width: 65rem">

        <Column field="codigo_entrada" header="CODIGO ENTRADA"></Column>  
        <Column field="tipo_entrada" header="TIPO ENTRADA"></Column>
        <Column field="fecha" header="FECHA"></Column>
        <Column field="total" header="TOTAL"></Column>


        <Column field="total_pagado" header="PAGADO">
            <template #body="slotProps">
                Bs {{ slotProps.data.total_pagado }}
            </template>
        </Column>

        <Column field="saldo_pendiente" header="SALDO">
            <template #body="slotProps">
                Bs {{ slotProps.data.saldo_pendiente }}
            </template>
        </Column>

        <Column field="estado_pago_texto" header="ESTADO">
            <template #body="slotProps">

                <Tag
                    :value="slotProps.data.estado_pago_texto"
                    :severity="
                        slotProps.data.estado_pago == 2
                            ? 'success'
                            : slotProps.data.estado_pago == 3
                                ? 'warning'
                                : 'danger'
                    "
                />

            </template>
        </Column>
        
        <Column field="proveedor.nombre" header="PROVEEDOR"></Column>
        <Column header="RESPONSABLE">
            <template #body="slotProps">
                {{
                    [
                        slotProps.data.empleado?.nombre,
                        slotProps.data.empleado?.apellido
                    ]
                    .filter(Boolean)
                    .join(' ') || 'Sin responsable'
                }}
            </template>
        </Column>
    
        <Column field="lotes" header="LOTES">
            <template #body="slotProps">
            <Button label="Mostrar Lotes" icon="pi pi-external-link"
                @click="verLotes(slotProps.data.lotes)"/>
            </template>
        </Column>

        <Column v-if="esAdmin" header="PAGOS">
            <template #body="slotProps">
                <Button
                    label="Pagos"
                    icon="pi pi-wallet"
                    severity="success"
                    @click="abrirPagos(slotProps.data)"
                />
            </template>
        </Column>


    </DataTable>

    <div class="flex flex-column sm:flex-row
        justify-content-between align-items-center
        gap-3 mt-3">

        <small class="text-600">
            Página {{ pagina }} de {{ totalPaginas }}
            · {{ totalEntradas }} entradas
        </small>

        <div class="flex gap-2">
            <Button
                label="Anterior"
                icon="pi pi-angle-left"
                severity="secondary"
                outlined
                :disabled="pagina <= 1"
                @click="pagina--; getEntradas()"
            />

            <Button
                label="Siguiente"
                icon="pi pi-angle-right"
                iconPos="right"
                severity="secondary"
                outlined
                :disabled="pagina >= totalPaginas"
                @click="pagina++; getEntradas()"
            />
        </div>
    </div>

    <Dialog
        v-model:visible="visible"
        modal
        header="Lotes"
        :style="{ width: 'min(95vw, 70rem)' }" >

            <DataTable
                :value="lotesDT"
                responsiveLayout="scroll"
                scrollable
                tableStyle="min-width: 45rem" >

              <Column field="id" header="ID"></Column>
              <Column field="codigo_lote" header="COD LOTE"></Column>
              <Column field="cantidad_inicial" header="CANTIDAD EN LOTE">
                </Column>
              <Column field="costo_unitario" header="COSTO_U EN LOTE"></Column>

              <Column field="pivot.cantidad" header="CANTIDAD DETALLE"></Column>
              <Column field="pivot.costo_unitario" header="COSTO_U DETALLE"></Column>
            </DataTable>
    </Dialog>
    
    <Dialog
        v-model:visible="visiblePago"
        modal
        header="Pagos de la Compra"
        :style="{
            width: '60rem',
            maxWidth: '96vw'
        }"
        :breakpoints="{
            '960px': '90vw',
            '640px': '96vw'
        }"
        :contentStyle="{
            maxHeight: '78vh',
            overflowY: 'auto',
            overflowX: 'hidden'
        }"  >

      <div class="grid">
          <div class="col-12">
              <h4>{{ entradaSeleccionada?.codigo_entrada }}</h4>
              <p>Total:
                  Bs {{ entradaSeleccionada?.total }}
              </p>
          </div>
            <div class="col-12">


                <div class="grid mb-3">
                    <div class="col-6 lg:col-3">
                        <Card>
                            <template #content>
                                <strong>Total</strong>
                                <br>
                                Bs {{ resumenPago.total }}
                            </template>
                        </Card>
                    </div>
                    <div class="col-6 lg:col-3">
                        <Card>
                            <template #content>
                                <strong>Pagado</strong>
                                <br>
                                Bs {{ resumenPago.pagado }}
                            </template>
                        </Card>
                    </div>
                    <div class="col-6 lg:col-3">
                        <Card>
                            <template #content>
                                <strong>Saldo</strong>
                                <br>
                                Bs {{ resumenPago.saldo }}
                            </template>
                        </Card>
                    </div>
                    <div class="col-6 lg:col-3">
                        <Card>
                            <template #content>
                                <strong>Estado</strong>
                                <br>
                                <Tag
                                    :value="textoEstadoPago"
                                    :severity="colorEstadoPago"
                                />
                            </template>
                        </Card>
                    </div>
                </div>

                <div class="tabla-scroll">
                    <DataTable
                        :value="pagos"
                        responsiveLayout="scroll"
                        scrollable
                        scrollHeight="220px"
                        tableStyle="min-width: 35rem"  >
                        <Column field="fecha_pago" header="Fecha"></Column>
                        <Column field="monto" header="Monto"></Column>
                        <Column field="metodo_pago" header="Método"></Column>
                        <Column field="observaciones" header="Observaciones"></Column>
                    </DataTable>
                </div>    
          </div>
          
          
          <div v-if="!compraPagada">

            <Divider />

            <h4>Registrar Pago</h4>

            <div class="grid">

                <div class="col-12 md:col-4">
                    <Calendar
                        v-model="nuevoPago.fecha_pago"
                        dateFormat="yy-mm-dd"
                        class="w-full"
                    />
                </div>

                <div class="col-12 md:col-4">
                    <strong>Monto: </strong>
                    <InputNumber
                        v-model="nuevoPago.monto"
                        mode="decimal"
                        class="w-full"
                    />
                </div>

                <div class="col-12 md:col-4">
                    <Dropdown
                        v-model="nuevoPago.metodo_pago"
                        :options="metodosPago"
                        class="w-full"
                    />
                </div>

                <div class="col-12">
                    <InputText
                        v-model="nuevoPago.observaciones"
                        placeholder="Observaciones"
                        class="w-full"
                    />
                </div>

                <div class="col-12">
                    <Button
                        label="Guardar Pago"
                        icon="pi pi-check"
                        @click="guardarPago"
                    />
                </div>

            </div>
          
          </div>
          <div v-else>

            <Message severity="success" :closable="false">

                <strong>Compra pagada completamente.</strong>

                <br>

                No es posible registrar más pagos para esta compra.

            </Message>

          </div>
        </div>  
    </Dialog>


  </div>
</template>


<script setup>
import entradaService from "@/service/EntradaService";
import PagoService from "@/service/PagoService";
import { ref } from "vue";
import { computed } from "vue";

let entradas = ref([]);
let visible = ref(false);
let lotesDT = ref([]);

const pagina = ref(1);
const totalPaginas = ref(1);
const totalEntradas = ref(0);

const visiblePago = ref(false);
const entradaSeleccionada = ref(null);
const pagos = ref([]);

const role = localStorage.getItem('role');
const esAdmin = role === 'admin';
 
 //const pagos
const nuevoPago = ref({
    fecha_pago: new Date().toISOString().split("T")[0],
    monto: null,
    metodo_pago: "Efectivo",
    observaciones: "",
    entrada_id: null
});

const metodosPago = [
    "Efectivo",
    "Transferencia",
    "QR",
    "Cheque"
];

const resumenPago = ref({
    total: 0,
    pagado: 0,
    saldo: 0,
    estado_pago: 1
});
const textoEstadoPago = computed(() => {

    switch (resumenPago.value.estado_pago) {

        case 1:
            return "Pendiente";

        case 2:
            return "Pagado";

        case 3:
            return "Parcial";

        default:
            return "Desconocido";

    }

});
const colorEstadoPago = computed(() => {

    switch (resumenPago.value.estado_pago) {

        case 1:
            return "danger";

        case 2:
            return "success";

        case 3:
            return "warning";

        default:
            return "info";

    }

});

const compraPagada = computed(() => {
    return resumenPago.value.estado_pago === 2;
});

// funciones:
/*async function getEntradas() {
  const { data } = await entradaService.listar();

  entradas.value = data.data;
}*/
async function getEntradas() {
    try {
        const { data } = await entradaService.listar(pagina.value);

        entradas.value = data.data;
        pagina.value = data.current_page;
        totalPaginas.value = data.last_page;
        totalEntradas.value = data.total;
    } catch (error) {
        console.error("Error al cargar entradas:", error);
    }
}

async function verLotes(lotes){
    visible.value = true
    lotesDT.value = lotes
}

async function abrirPagos(entrada) {
    entradaSeleccionada.value = entrada;
    nuevoPago.value = {
        fecha_pago: new Date().toISOString().split("T")[0],
        monto: null,
        metodo_pago: "Efectivo",
        observaciones: "",
        entrada_id: entrada.id
    };
    const { data } = await PagoService.listar(entrada.id);

    pagos.value = data;
    let pagado = 0;
    pagos.value.forEach(p => {
        pagado += Number(p.monto);
    });

    resumenPago.value = {
        total: Number(entrada.total),
        pagado,
        saldo: Number(entrada.total) - pagado,
        estado_pago: entrada.estado_pago
    };
    visiblePago.value = true;
}

async function guardarPago() {
    if (compraPagada.value) {
        return;
    }
    try {
        const { data } = await PagoService.guardar(nuevoPago.value);
        resumenPago.value = data.resumen;
        const pagosData = await PagoService.listar(entradaSeleccionada.value.id);
        pagos.value = pagosData.data;
        nuevoPago.value.monto = null;
        nuevoPago.value.observaciones = "";

        getEntradas();
    } catch (error) {
        alert(error.response?.data?.message || "Error al registrar pago");
    }
}

getEntradas();
</script>

<style scoped>

.tabla-scroll {
    width: 100%;
    max-width: 100%;
    overflow-x: auto;
}

:deep(.p-dialog-content) {
    max-width: 100%;
    overflow-x: hidden;
}

:deep(.p-inputnumber),
:deep(.p-calendar),
:deep(.p-dropdown),
:deep(.p-inputtext) {
    width: 100%;
    min-width: 0;
}

@media screen and (max-width: 640px) {
    :deep(.p-dialog-content) {
        padding-left: 0.75rem;
        padding-right: 0.75rem;
    }
}

</style>