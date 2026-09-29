<template>
  <!--{{ salidas }}-->
  <div class="card">
    <h1>Lista de Salidas</h1>
    <DataTable :value="salidas" tableStyle="min-width: 50rem">
      
      <Column field="codigo_salida" header="CODIGO"></Column>
      <!-- Considerar si deberia haber cantidad en ventas o en el detalle-->
      <!--<Column field="cantidad" header="CANTIDAD"></Column>-->
      <Column field="fecha" header="FECHA"></Column>
      <Column header="Tipo">
        <template #body="slotProps">
            <Tag :value="nombreTipoSalida(slotProps.data.tipo)" />
        </template>
      </Column>
      <Column header="Responsable">
        <template #body="slotProps">
            {{ slotProps.data.empleado?.nombre || 'Sin responsable' }}
        </template>
      </Column>
      <Column field="observaciones" header="OBSERVACIONES"></Column>

      <Column field="lotes" header="LOTES">
        <template #body="slotProps">
          <Button label="Mostrar Lotes" icon="pi pi-external-link"
            @click="verLotes(slotProps.data.lotes)"/>
        </template>
      </Column>
            
    </DataTable>

    <div class="flex justify-content-center gap-2 mt-3">

      <Button
      label="Anterior"
      icon="pi pi-angle-left"
      :disabled="pagina===1"
      @click="pagina--; getSalidas()"
      />


      <span>
      Página {{pagina}} de {{totalPaginas}}
      </span>


      <Button
      label="Siguiente"
      icon="pi pi-angle-right"
      :disabled="pagina===totalPaginas"
      @click="pagina++; getSalidas()"
      />

    </div>

    <Dialog v-model:visible="visible" modal header="Lotes" :style="{ width: '50vw' }">
            <DataTable :value="lotesDT" tableStyle="min-width: 50rem">

              <!--<Column field="id" header="ID LOTE"></Column> -->
              <Column field="codigo_lote" header="COD LOTE"></Column>
              <!--<Column field="cantidad_actual" header="CANTIDAD EN LOTE"></Column> -->
              
              <Column field="pivot.cantidad" header="CANTIDAD RETIRADA"></Column>
              <Column field="costo_unitario" header="COSTO UNITARIO"></Column>
            
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
const pagina = ref(1);
const totalPaginas = ref(1);


async function getSalidas() {
  const { data } = await salidaService.listar(pagina.value);

  salidas.value = data.data;
  pagina.value = data.current_page; //new
  totalPaginas.value=data.last_page; //new
}

async function verLotes(lotes){
    visible.value = true
    lotesDT.value = lotes
}

getSalidas();

const nombreTipoSalida = (tipo) => {
    const tipos = {
        1: 'Venta',
        2: 'Robo',
        3: 'Pérdida',
        4: 'Deterioro',
        5: 'Ajuste negativo'
    };

    return tipos[Number(tipo)] || 'Desconocido';
};

async function cargarSalidas(){

  const response = await salidaService.listar(
      paginaActual.value
  );

  salidas.value=response.data.data;
  totalPaginas.value=response.data.last_page;

}

</script>
