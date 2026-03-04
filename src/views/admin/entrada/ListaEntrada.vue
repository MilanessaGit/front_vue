<template>
  <!--{{ salidas }}-->
  <div class="card">
    <h1>Lista de Entradas</h1>
    <DataTable :value="entradas" tableStyle="min-width: 50rem">
        <Column field="codigo_entrada" header="CODIGO ENTRADA"></Column>
        <!-- Considerar si deberia haber cantidad en ventas o en el detalle-->
        <!--<Column field="cantidad" header="CANTIDAD"></Column>-->
        <Column field="fecha" header="FECHA"></Column>
        <Column field="total" header="TOTAL"></Column>
        
        <Column field="proveedor.nombre" header="PROVEEDOR"></Column>
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