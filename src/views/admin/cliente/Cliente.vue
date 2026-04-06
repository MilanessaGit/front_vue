<template>

<Button label="Nuevo Cliente" icon="pi pi-external-link" @click="abrirDialogCliente" />

<Dialog v-model:visible="dialogNuevoCliente" modal header="Nuevo Cliente" :style="{ width: '50vw' }" class="p-fluid">
        <!--{{ cliente }}-->
    <div class="field">
        <label for="cod">Ingrese Codigo</label>
        <InputText type="text" id="cod" v-model="cliente.id" required autofocus  />
    </div>
    <div class="field">
        <label for="nom">Ingrese Nombre</label>
        <InputText type="text" id="nom" v-model="cliente.nombre" required autofocus  />
    </div>
    <div class="field">
        <label for="nom">Ingrese Apellidos</label>
        <InputText type="text" id="nom" v-model="cliente.apellido" required autofocus  />
    </div>
    <div class="field">
        <label for="nom">Ingrese CI/NIT</label>
        <InputText type="text" id="nom" v-model="cliente.ci_nit" required autofocus  />
    </div>
    <div class="field">
        <label for="nom">Ingrese Telefono</label>
        <InputText type="text" id="nom" v-model="cliente.telefono" required autofocus  />
    </div>
    <div class="field">
        <label for="desc">Direccion</label>
        <Textarea id="desc" v-model="cliente.direccion"></Textarea>
    </div>

    <template #footer>
        <Button label="Cancelar" icon="pi pi-times" class="p-button-text" @click="cerrarDialogCliente"></Button>
        <Button label="Guardar" icon="pi pi-check" class="p-button-text" @click="guardarCliente"></Button>

    </template>

</Dialog>
    <!--{{ clientes }}-->
<!--Tabla Clientes -->
  <DataTable ref="dt" :value="clientes" paginator :rows="5" :rowsPerPageOptions="[5, 10, 20, 50]" tableStyle="min-width: 50rem"
              lazy :totalRecords="totalRecords" :loading="loading" @page="onPage($event)">
    <template #header>
      <div
        class="flex flex-wrap align-items-center justify-content-between gap-2"
      >
        <span class="text-xl text-900 font-bold">CLIENTES</span>
        <Button icon="pi pi-refresh" rounded raised />
      </div>
    </template>

    <!-- Columnas -->
    <Column field="id" header="ID"></Column>

    <Column field="nombre" header="Nombre"></Column>
    <Column field="apellido" header="Apellido"></Column>
    <Column field="ci_nit" header="CI/NIT"></Column>
    <Column field="telefono" header="Telefono"></Column>
    <Column field="direccion" header="Direccion"></Column>

    <Column field="acciones" header="Accion">
      <template #body="slotProps">        

          <Button icon="pi pi-pencil" class="p-button-rounded p-button-warning" rounded  @click="editarCliente(slotProps.data)" />
          <Button v-if="puedeEliminar" icon="pi pi-times" class="p-button-rounded p-button-danger" aria-label="Eliminar" @click="eliminarCliente(slotProps.data.id)" />
      </template>
    </Column>

    <template #footer>
      En total hay {{ totalRecords ? totalRecords : 0 }} clientes. <!--Si existe totalRecords muestra sino pon 0 -->
    </template>
  </DataTable>


</template>

<script setup>
import { ref } from "vue";
import clienteService from "@/service/ClienteService";
import axios from 'axios'

const clientes = ref([]);
const dialogNuevoCliente = ref(false)
const cliente = ref({})

const id_cliente = ref(-1)
const totalRecords = ref(0)
const loading = ref(false)
const lazyParams = ref({});

const role = localStorage.getItem("role")
const esAdmin = role === 'admin';
const puedeCrear = role === 'admin' || role === 'supervisor'
const puedeEditar = role === 'admin' || role === 'supervisor'
const puedeEliminar = role === 'admin'

const abrirDialogCliente = () => {
    cliente.value = {}
    dialogNuevoCliente.value = true
}

const cerrarDialogCliente = () => {
    dialogNuevoCliente.value = false
}


const onPage = (event) => {
    lazyParams.value = event;
    loadLazyData();
};

const loadLazyData = async () => {
    loading.value = true;
    
    const {data} = await clienteService.listar({ lazyEvent: JSON.stringify(lazyParams.value) })
    clientes.value = data.data;
    totalRecords.value = data.total;
    loading.value = false;

};

// clienteService 
const listaClientes = async() => {
    loading.value = true;
    const {data} = await clienteService.listar({ lazyEvent: JSON.stringify(lazyParams.value) });

    console.log(data.data)

    clientes.value = data.data;
    totalRecords.value = data.total;
    loading.value = false;
}
const editarCliente = (cli) => {

  cliente.value = cli

  dialogNuevoCliente.value = true

}


listaClientes()


const guardarCliente = async () => {
  console.log(cliente.value)
  if(cliente.value.id){

    await clienteService.modificar(cliente.value.id, cliente.value);
  }else{
    await clienteService.guardar(cliente.value);
  }
    cliente.value = {} 
    listaClientes()
    cerrarDialogCliente()
}

const eliminarCliente = async (id) => {

  if (id) {
    if(confirm("Esta seguro de eliminar el cliente?")){
      loading.value = true;
      await clienteService.eliminar(id);
      loading.value = false;
      loadLazyData()
    }

  }
}

</script>