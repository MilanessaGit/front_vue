<template>

<Button label="Nuevo Proveedor" icon="pi pi-external-link" @click="abrirDialogProveedor" />

<Dialog v-model:visible="dialogNuevoProveedor" modal header="Nuevo Proveedor" :style="{ width: '50vw' }" class="p-fluid">
        <!--{{ product }}-->
    <div class="field">
        <label for="cod">Ingrese Codigo</label>
        <InputText type="text" id="cod" v-model="proveedor.id" required autofocus  />
    </div>
    <div class="field">
        <label for="cod">Ingrese Codigo Proveedor</label>
        <InputText type="text" id="cod" v-model="proveedor.codigo_proveedor" required autofocus  />
    </div>
    <div class="field">
        <label for="nom">Ingrese Nombre</label>
        <InputText type="text" id="nom" v-model="proveedor.nombre" required autofocus  />
    </div>
    <div class="field">
        <label for="ape">Ingrese Apellido</label>
        <InputText type="text" id="ape" v-model="proveedor.apellido" required autofocus  />
    </div>
    <div class="field">
        <label for="ci">Ingrese CI/NIT</label>
        <InputText type="text" id="ci" v-model="proveedor.ci_nit" required autofocus  />
    </div>
 
    <div class="field">
        <label for="tel">Ingrese Telefono</label>
        <InputText type="text" id="tel" v-model="proveedor.telefono" required autofocus  />
    </div>
    <div class="field">
        <label for="desc">Direccion</label>
        <Textarea id="desc" v-model="proveedor.direccion"></Textarea>
    </div>

    

    <template #footer>
        <Button label="Cancelar" icon="pi pi-times" class="p-button-text" @click="cerrarDialogProveedor"></Button>
        <Button label="Guardar" icon="pi pi-check" class="p-button-text" @click="guardarProveedor"></Button>

    </template>

</Dialog>
    <!--{{ proveedors }}-->
<!--Tabla Proveedores -->
  <DataTable ref="dt" :value="proveedors" paginator :rows="5" :rowsPerPageOptions="[5, 10, 20, 50]" tableStyle="min-width: 50rem"
              lazy :totalRecords="totalRecords" :loading="loading" @page="onPage($event)">
    <template #header>
      <div
        class="flex flex-wrap align-items-center justify-content-between gap-2"
      >
        <span class="text-xl text-900 font-bold">PROVEEDORES</span>
        <Button icon="pi pi-refresh" rounded raised />
      </div>
    </template>

    <!-- Columnas -->
    <Column field="id" header="ID"></Column>
    <Column field="codigo_proveedor" header="Codigo Proveedor"></Column>
    <Column field="nombre" header="Nombre"></Column>
    <Column field="apellido" header="Apellido"></Column>
    <Column field="ci_nit" header="CI/NIT"></Column>
    
    <Column field="telefono" header="Telefono"></Column>
    <Column field="direccion" header="Direccion"></Column>
    
    
    
    <!-- <Column field="estado" header="Estado"> 
      <template #body="slotProps">
        {{ slotProps.data.estado?'activo':'inactivo' }}
      </template>
    </Column> -->

    <Column field="acciones" header="Accion">
      <template #body="slotProps">        

          <Button icon="pi pi-pencil" class="p-button-rounded p-button-warning" rounded  @click="editarProveedor(slotProps.data)" />
          <Button icon="pi pi-times" class="p-button-rounded p-button-danger" aria-label="Eliminar" @click="eliminarProveedor(slotProps.data.id)" />
      </template>
    </Column>

    <template #footer>
      En total hay {{ totalRecords ? totalRecords : 0 }} proveedores. <!--Si existe totalRecords muestra sino pon 0 -->
    </template>
  </DataTable>

</template>

<script setup>
import { ref } from "vue";
import proveedorService from "@/service/ProveedorService";

import axios from 'axios'

const proveedors = ref([]);
const dialogNuevoProveedor = ref(false)
const proveedor = ref({})



const id_proveedor = ref(-1)
const totalRecords = ref(0)
const loading = ref(false)
const lazyParams = ref({});

const abrirDialogProveedor = () => {
    proveedor.value = {}
    dialogNuevoProveedor.value = true
}

const cerrarDialogProveedor = () => {
    dialogNuevoProveedor.value = false
}

const onPage = (event) => {
    lazyParams.value = event;
    loadLazyData();
};

const loadLazyData = async () => {
    loading.value = true;
    
    const {data} = await proveedorService.listar({ lazyEvent: JSON.stringify(lazyParams.value) })
    proveedors.value = data.data;
    totalRecords.value = data.total;
    loading.value = false;

};

// proveedorService 
const listaProveedores = async() => {
    loading.value = true;
    const {data} = await proveedorService.listar({ lazyEvent: JSON.stringify(lazyParams.value) });

    console.log(data.data)

    proveedors.value = data.data;
    totalRecords.value = data.total;
    loading.value = false;
}
const editarProveedor = (prov) => {

  proveedor.value = prov

  dialogNuevoProveedor.value = true

}


listaProveedores()

const guardarProveedor = async () => {
  console.log(proveedor.value)
  if(proveedor.value.id){
    await proveedorService.modificar(proveedor.value.id, proveedor.value);
  }else{
    await proveedorService.guardar(proveedor.value);
  }
    proveedor.value = {} 
    listaProveedores()
    cerrarDialogProveedor()
}

const eliminarProveedor = async (id) => {

  if (id) {
    if(confirm("Esta seguro de eliminar el proveedor?")){
      loading.value = true;
      await proveedorService.eliminar(id);
      loading.value = false;
      loadLazyData()
    }

  }
}


</script>