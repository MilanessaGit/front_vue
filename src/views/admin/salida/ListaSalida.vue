<template>
  <!--{{ salidas }}-->
  <div class="card">
    <h1>Lista de Salidas</h1>
    <DataTable :value="salidas" tableStyle="min-width: 50rem">
      
      <Column field="codigo_salida" header="CODIGO SALIDA"></Column>
      <!-- Considerar si deberia haber cantidad en ventas o en el detalle-->
      <!--<Column field="cantidad" header="CANTIDAD"></Column>-->
      <Column field="fecha" header="FECHA"></Column>
      <Column field="total" header="TOTAL"></Column>
      
      
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
              
            </DataTable>
    </Dialog>
  </div>

</template>    

<script setup>
import salidaService from "@/service/SalidaService";
import { ref } from "vue";

let salidas = ref([]);
let visible = ref(false);

let lotesDT = ref([]);

async function getSalidas() {
  const { data } = await salidaService.listar();

  salidas.value = data.data;
}

async function verLotes(lotes){
    visible.value = true
    lotesDT.value = lotes
}

getSalidas();
</script>
