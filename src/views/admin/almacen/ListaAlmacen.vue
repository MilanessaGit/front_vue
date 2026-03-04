<template>
  <!--{{ salidas }}-->
  <div class="card">
        <h1>Lista de Almacenes</h1>
        <DataTable :value="almacenes" tableStyle="min-width: 50rem">
            <Column field="codigo_almacen" header="CODIGO ALMACEN"></Column>
            <Column field="nombre" header="NOMBRE"></Column>
            <Column field="ubicacion" header="UBICACION"></Column>
            <Column field="capacidad" header="CAPACIDAD"></Column>
            <Column field="estado" header="ESTADO"></Column>
        </DataTable>
    </div>
</template>