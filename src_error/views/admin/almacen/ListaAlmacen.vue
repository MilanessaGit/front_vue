<template>
  <!--{{ salidas }}-->
  <div class="card">
        <h1>Lista de Almacenes</h1>
        <DataTable :value="almacenes" tableStyle="min-width: 50rem">
            <Column field="id" header="ID"></Column>
            <Column field="nombre" header="NOMBRE"></Column>
            <Column field="ubicacion" header="UBICACION"></Column>
            
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
import almacenService from "@/service/AlmacenService";
import { ref } from "vue";

let almacenes = ref([]);
let visible = ref(false);

let lotesDT = ref([]);

async function getAlmacenes() {
  const { data } = await almacenService.listar();

  almacenes.value = data.data;
}

async function verLotes(lotes){
    visible.value = true
    lotesDT.value = lotes
}

getAlmacenes();
</script>