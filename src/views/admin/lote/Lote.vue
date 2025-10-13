<template>
    <Button label="Nuevo Lote" icon="pi pi-external-link" @click="abrirDialogLote" />

    <Dialog v-model:visible="dialogNuevoLote" modal header="Nuevo Lote" :style="{ width: '50vw' }" class="p-fluid">
        {{ lot }}
        <div class="field">
            <label for="cod">Ingrese Codigo</label>
            <InputText type="text" id="cod" v-model="lot.codigo_lote" required autofocus  />
        </div>
        <div class="field col">
                <label for="cant">Cantidad</label>
                <InputNumber id="cant" v-model="lot.cantidad" integeronly></InputNumber>
        </div>
        
        <div class="field">
            <label for="nomp">ID Prod</label>
            <InputText type="text" id="nomp" v-model="lot.producto_id"  />
        </div>
        <div class="field">
            <label>Producto</label>
            <div class="formgrid grid">
              
                <div class="field-radiobutton col-6" v-for="produ in productos" :key="produ.id">
                    <RadioButton :value="produ.id" v-model="lot.producto_id"></RadioButton>
                    <label >{{produ.codigo_producto}}</label>
                </div>
        
            </div>
        </div>
        <div class="formgrid grid">
            <div class="field col">
                <label for="pr">Precio Unitario </label>
                <InputNumber id="cost" v-model="lot.costo_unitario" mode="currency" currency="USD" locale="en-US"></InputNumber>
            </div>
        </div>
        
        <!--<div class="field">
            <label for="desc">Trazabilidad</label>
            <Textarea id="desc" v-model="lot.trazabilidad"></Textarea>
        </div>-->
        

        <template #footer>
            <Button label="Cancelar" icon="pi pi-times" class="p-button-text" @click="cerrarDialogLote"></Button>
            <Button label="Guardar" icon="pi pi-check" class="p-button-text" @click="guardarLote"></Button>

        </template>

    </Dialog>


{{  lots }}
<!--Tabla Lotes -->
<DataTable ref="dt" :value="lots" paginator :rows="5" :rowsPerPageOptions="[5, 10, 20, 50]" tableStyle="min-width: 50rem"
              lazy :totalRecords="totalRecords" :loading="loading" @page="onPage($event)">
        <template #header>
            <div class="flex flex-wrap align-items-center justify-content-between gap-2">
                <span class="text-xl text-900 font-bold">LOTES</span>
                <Button icon="pi pi-refresh" rounded raised />
            </div>
        </template>

    <!-- Columnas -->
    <Column field="id" header="ID"></Column>
    <Column field="codigo_lote" header="COD_LOT"></Column>
    <Column field="cantidad" header="Cantidad"></Column>
    
    <Column field="costo_unitario" header="Costo_U">
      <template #body="slotProps">
        {{ formatCurrency(slotProps.data.costo_unitario) }}
      </template>
    </Column>
    <Column field="producto.codigo_producto" header="Codigo Prod"></Column>
    <Column field="producto.nombre" header="Producto"></Column>
    
    <Column field="estado" header="Estado"> 
      <template #body="slotProps">
        {{ slotProps.data.estado?'activo':'inactivo' }}
      </template>
    </Column>

    <Column field="acciones" header="Accion">
      <template #body="slotProps">        
          <Button icon="pi pi-pencil" class="p-button-rounded p-button-warning" rounded  @click="editarLote(slotProps.data)" />
          <Button icon="pi pi-times" class="p-button-rounded p-button-danger" aria-label="Eliminar" @click="eliminarLote(slotProps.data.id)" />
      </template>
    </Column>

    <template #footer>
      En total hay {{ totalRecords ? totalRecords : 0 }} Lotes. <!--Si existe totalRecords muestra sino pon 0 -->
    </template>
</DataTable>

</template>

<script setup>
import { ref } from "vue";
import productoService from "@/service/ProductoService";
//import categoriaService from "@/service/CategoriaService";
import loteService from "@/service/LoteService";

const lots = ref([]);
const dialogNuevoLote = ref(false) // Lote
const lot = ref({})
const productos = ref([]); // en vez de categ
//const visible_img = ref(false) 
// id_lote -1  solo para imagen
const totalRecords = ref(0)
const loading = ref(false)
const lazyParams = ref({});

//Dialog
const abrirDialogLote = () => {
    
    lot.value = {} // lote ++
    console.log("dialogg", lot.value) //++
    dialogNuevoLote.value = true
}

const cerrarDialogLote = () => {
    dialogNuevoLote.value = false
}

const onPage = (event) => {
    lazyParams.value = event;
    loadLazyData();
};

const loadLazyData = async () => {
    loading.value = true;
    
    const {data} = await loteService.listar({ lazyEvent: JSON.stringify(lazyParams.value) })
    lots.value = data.data;
    console.log("Lotes recibidos:", lots.value); //++
    const lotesSinId = lots.value.filter(lote => lote && !lote.id);
    if (lotesSinId.length > 0) {
    console.warn("¡Hay lotes sin id!", lotesSinId);
    }
    //++
    totalRecords.value = data.total;
    loading.value = false;

};

// loteService 
const listaLotes = async() => {
    loading.value = true;
    const {data} = await loteService.listar({ lazyEvent: JSON.stringify(lazyParams.value) });

    console.log(data.data)

    lots.value = data.data;
    totalRecords.value = data.total;
    loading.value = false;
}
const editarLote = (lt) => { //lot
    console.log("editar", lt)

  lot.value = lt || {}; // Si lt es null, asigna objeto vacío

  dialogNuevoLote.value = true // lote

}

const listaProductos = async() => { //productos v
    
    const {data} = await productoService.listar({ lazyEvent: JSON.stringify(lazyParams.value) });
    console.log("lista prod",data.data) // se muestra el array de productos en concreto que hay
    productos.value = data.data; // v
    console.log("list prod", data) // se muestra el objeto en general la page donde adentro estaran los productos
}
listaLotes()
listaProductos()// prod


const guardarLote = async () => { // lote
  console.log("guardar vvalue",lot.value)
  console.log("guardar vvalue id",lot.value.id)
  if(lot.value.id){
    await loteService.modificar(lot.value.id, lot.value);
  }else{
    await loteService.guardar(lot.value);
  }
    lot.value = {} 
    listaLotes()
    cerrarDialogLote() /// lote
}

const eliminarLote = async (id) => {

  if (id) {
    if(confirm("Esta seguro de eliminar el lote?")){
      loading.value = true;
      await loteService.eliminar(id);
      loading.value = false;
      loadLazyData()
    }

  }
}

const formatCurrency = (value) => {
    return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
};

</script>