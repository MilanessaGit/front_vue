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
      
      <Column field="cliente.nombre" header="CLIENTE"></Column>
      <Column field="empleado_id" header="EMPLEADO ID"></Column>

      <Column field="lotes" header="LOTES">
        <template #body="slotProps">
          <Button label="Mostrar Lotes" icon="pi pi-external-link"
            @click="verLotes(slotProps.data.lotes)"/>
        </template>
      </Column>
      <Column field="estado" header="ESTADO"></Column>
    </DataTable>
  </div>

</template>    
