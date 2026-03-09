<template>
  <!--{{ salidas }}-->
  <div class="card">
    <h1>Lista de Entradas</h1>
    <DataTable :value="entradas" tableStyle="min-width: 50rem">
        <Column field="codigo_entrada" header="CODIGO ENTRADA"></Column>
        <!-- Considerar si deberia haber cantidad en ventas o en el detalle-->
        <!--<Column field="cantidad" header="CANTIDAD"></Column>-->
        <Column field="fecha" header="FECHA"></Column>
        <Column field="precio_total" header="TOTAL"></Column>
        
        <Column field="proveedor.nombre" header="PROVEEDOR"></Column>
        <Column field="empleado_id" header="EMPLEADO ID"></Column>
    
        <Column field="lotes" header="LOTES">
            <template #body="slotProps">
            <Button label="Mostrar Lotes" icon="pi pi-external-link"
                @click="verLotes(slotProps.data.lotes)"/>
            </template>
        </Column>
        
    </DataTable>

    <Dialog v-model:visible="visible" modal header="Lotes" :style="{ width: '50vw' }">
            <DataTable :value="lotesDT" tableStyle="min-width: 50rem">

              <Column field="id" header="ID"></Column>
              <Column field="codigo_lote" header="COD LOTE"></Column>
              <Column field="cantidad" header="CANTIDAD EN LOTE"></Column>
              <Column field="costo_unitario" header="COSTO_U EN LOTE"></Column>
              <Column field="pivot.cantidad" header="CANTIDAD DETALLE"></Column>
              <Column field="pivot.precio_unitario" header="PRECIO_U DETALLE"></Column>
            </DataTable>
    </Dialog>
  </div>
</template>


<script setup>
import entradaService from "@/service/EntradaService";
import { ref } from "vue";

let entradas = ref([]);
let visible = ref(false);

let lotesDT = ref([]);

async function getEntradas() {
  const { data } = await entradaService.listar();

  entradas.value = data.data;
}

async function verLotes(lotes){
    visible.value = true
    lotesDT.value = lotes
}

getEntradas();
</script>