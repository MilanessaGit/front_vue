<template>

<Button label="Nuevo empleado" icon="pi pi-external-link" @click="abrirDialogEmpleado" />

<Dialog v-model:visible="dialogNuevoEmpleado" modal header="Nuevo Empleado" :style="{ width: '50vw' }" class="p-fluid">
        <!--{{ product }}-->
    <div class="field">
        <label for="cod">Ingrese Codigo</label>
        <InputText type="text" id="cod" v-model="empleado.id" required autofocus  />
    </div>
    <div class="field">
        <label for="nom">Ingrese Nombre</label>
        <InputText type="text" id="nom" v-model="empleado.nombre" required autofocus  />
    </div>
    <div class="field">
        <label for="ape">Ingrese Apellido</label>
        <InputText type="text" id="ape" v-model="empleado.apellido" required autofocus  />
    </div>
    <div class="field">
        <label for="ci">Ingrese CI/NIT</label>
        <InputText type="text" id="ci" v-model="empleado.ci_nit" required autofocus  />
    </div>
    <div class="field">
        <label for="edad">Ingrese Edad</label>
        <InputText type="number" id="edad" v-model="empleado.edad" required autofocus  />
    </div>
    <div class="field">
        <label for="tel">Ingrese Telefono</label>
        <InputText type="text" id="tel" v-model="empleado.telefono" required autofocus  />
    </div>
    <div class="field">
        <label for="desc">Direccion</label>
        <Textarea id="desc" v-model="empleado.direccion"></Textarea>
    </div>

    <div class="field">
        <label>Usuario: </label>
        <div class="formgrid grid">
            <div class="field-radiobutton col-6" v-for="usr in usuarios" :key="usr.id">
                <RadioButton :value="usr.id" v-model="empleado.usuario_id"></RadioButton>
                <label >{{usr.email}}</label>

            </div>
        </div>
    </div>

    <template #footer>
        <Button label="Cancelar" icon="pi pi-times" class="p-button-text" @click="cerrarDialogEmpleado"></Button>
        <Button label="Guardar" icon="pi pi-check" class="p-button-text" @click="guardarEmpleado"></Button>

    </template>

</Dialog>
    <!--{{ empleados }}-->
<!--Tabla Emplados -->
  <DataTable ref="dt" :value="empleados" paginator :rows="5" :rowsPerPageOptions="[5, 10, 20, 50]" tableStyle="min-width: 50rem"
              lazy :totalRecords="totalRecords" :loading="loading" @page="onPage($event)">
    <template #header>
      <div
        class="flex flex-wrap align-items-center justify-content-between gap-2"
      >
        <span class="text-xl text-900 font-bold">EMPLEADOS</span>
        <Button icon="pi pi-refresh" rounded raised />
      </div>
    </template>

    <!-- Columnas -->
    <Column field="id" header="ID"></Column>

    <Column field="nombre" header="Nombre"></Column>
    <Column field="apellido" header="Apellido"></Column>
    <Column field="ci_nit" header="CI/NIT"></Column>
    <Column field="edad" header="Edad"></Column>
    <Column field="telefono" header="Telefono"></Column>
    <Column field="direccion" header="Direccion"></Column>
    
    <Column field="user.email" header="Email"></Column>
    
    <!-- <Column field="estado" header="Estado"> 
      <template #body="slotProps">
        {{ slotProps.data.estado?'activo':'inactivo' }}
      </template>
    </Column> -->

    <Column field="acciones" header="Accion">
      <template #body="slotProps">        

          <Button icon="pi pi-pencil" class="p-button-rounded p-button-warning" rounded  @click="editarEmpleado(slotProps.data)" />
          <Button icon="pi pi-times" class="p-button-rounded p-button-danger" aria-label="Eliminar" @click="eliminarEmpleado(slotProps.data.id)" />
      </template>
    </Column>

    <template #footer>
      En total hay {{ totalRecords ? totalRecords : 0 }} empleados. <!--Si existe totalRecords muestra sino pon 0 -->
    </template>
  </DataTable>

</template>

<script setup>
import { ref } from "vue";
import empleadoService from "@/service/EmpleadoService";
import usuarioService from "@/service/UsuarioService";
import axios from 'axios'

const empleados = ref([]);
const dialogNuevoEmpleado = ref(false)
const empleado = ref({})

const usuarios = ref([]);

const id_empleado = ref(-1)
const totalRecords = ref(0)
const loading = ref(false)
const lazyParams = ref({});

const abrirDialogEmpleado = () => {
    empleado.value = {}
    dialogNuevoEmpleado.value = true
}

const cerrarDialogEmpleado = () => {
    dialogNuevoEmpleado.value = false
}

const onPage = (event) => {
    lazyParams.value = event;
    loadLazyData();
};

const loadLazyData = async () => {
    loading.value = true;
    
    const {data} = await empleadoService.listar({ lazyEvent: JSON.stringify(lazyParams.value) })
    empleados.value = data.data;
    totalRecords.value = data.total;
    loading.value = false;

};

// empleadoService 
const listaEmpleados = async() => {
    loading.value = true;
    const {data} = await empleadoService.listar({ lazyEvent: JSON.stringify(lazyParams.value) });

    console.log(data.data)

    empleados.value = data.data;
    totalRecords.value = data.total;
    loading.value = false;
}
const editarEmpleado = (emp) => {

  empleado.value = emp

  dialogNuevoEmpleado.value = true

}


const listaUsuarios = async() => {
    const {data} = await usuarioService.listar();

    usuarios.value = data
}


listaEmpleados()
listaUsuarios()

const guardarEmpleado = async () => {
  console.log(empleado.value)
  if(empleado.value.id){
    await empleadoService.modificar(empleado.value.id, empleado.value);
  }else{
    await empleadoService.guardar(empleado.value);
  }
    empleado.value = {} 
    listaEmpleados()
    cerrarDialogEmpleado()
}

const eliminarEmpleado = async (id) => {

  if (id) {
    if(confirm("Esta seguro de eliminar el empleado?")){
      loading.value = true;
      await empleadoService.eliminar(id);
      loading.value = false;
      loadLazyData()
    }

  }
}


</script>