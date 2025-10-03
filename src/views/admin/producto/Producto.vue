<template>

<Button label="Nuevo producto" icon="pi pi-external-link" @click="abrirDialogProducto" />

<Dialog v-model:visible="dialogNuevoProducto" modal header="Nuevo Producto" :style="{ width: '50vw' }" class="p-fluid">
    {{ product }}
    <div class="field">
        <label for="cod">Ingrese Codigo</label>
        <InputText type="text" id="cod" v-model="product.codigo_producto" required autofocus  />
    </div>
    <div class="field">
        <label for="nom">Ingrese Nombre</label>
        <InputText type="text" id="nom" v-model="product.nombre" required autofocus  />
    </div>
    <div class="field">
        <label for="desc">Descripción</label>
        <Textarea id="desc" v-model="product.descripcion"></Textarea>
    </div>
    <div class="field">
        <label >Categoria</label>
        <div class="formgrid grid">
            <div class="field-radiobutton col-6" v-for="cat in categorias" :key="cat.id">
                <RadioButton :value="cat.id" v-model="product.categoria_id"></RadioButton>
                <label >{{cat.nombre}}</label>

            </div>
        </div>
    </div>
    <div class="formgrid grid">
        <div class="field col">
            <label for="pr">Precio</label>
            <InputNumber id="pr" v-model="product.precio_sugerido" mode="currency" currency="USD" locale="en-US"></InputNumber>
        </div>
        <!--<div class="field col">
            <label for="cant">Cantidad</label>
            <InputNumber id="cant" v-model="product.stock" integeronly></InputNumber>
        </div>-->
    </div>

    <template #footer>
        <Button label="Cancelar" icon="pi pi-times" class="p-button-text" @click="cerrarDialogProducto"></Button>
        <Button label="Guardar" icon="pi pi-check" class="p-button-text" @click="guardarProducto"></Button>

    </template>

</Dialog>
{{ products }}
<!--Tabla Productos -->
  <DataTable ref="dt" :value="products" paginator :rows="5" :rowsPerPageOptions="[5, 10, 20, 50]" tableStyle="min-width: 50rem"
              lazy :totalRecords="totalRecords" :loading="loading" @page="onPage($event)">
    <template #header>
      <div
        class="flex flex-wrap align-items-center justify-content-between gap-2"
      >
        <span class="text-xl text-900 font-bold">Productos</span>
        <Button icon="pi pi-refresh" rounded raised />
      </div>
    </template>

    <!-- Columnas -->
    <Column field="id" header="ID"></Column>
    <Column field="codigo_producto" header="COD_PROD"></Column>

    <Column field="nombre" header="Nombre"></Column>
    <Column header="Imagen">
      <template #body="slotProps">
        <img
        
          :src="slotProps.data.imagen?`http://127.0.0.1:8000/${slotProps.data.imagen}`:`https://img.freepik.com/vector-premium/vector-icono-imagen-predeterminado-pagina-imagen-faltante-diseno-sitio-web-o-aplicacion-movil-no-hay-foto-disponible_87543-11093.jpg`"
          :alt="slotProps.data.imagen"
          class="w-6rem shadow-2 border-round"
        />
        <Button icon="pi pi-camera" @click="seleccionarImagen(slotProps.data.id)" />

      </template>
    </Column>
    <Column field="precio_sugerido" header="Precio">
      <template #body="slotProps">
        {{ formatCurrency(slotProps.data.precio_sugerido) }}
      </template>
    </Column>

    <Column field="modelo" header="Modelo"></Column>
    <Column field="color" header="Color"></Column> 
    <Column field="caracteristicas_tecnicas" header="C. Tecnica"></Column>
    
    <Column field="categoria.nombre" header="Categoria"></Column>
    
    <!-- <Column field="estado" header="Estado"> 
      <template #body="slotProps">
        {{ slotProps.data.estado?'activo':'inactivo' }}
      </template>
    </Column> -->

    <Column field="acciones" header="Accion">
      <template #body="slotProps">        
          <Button icon="pi pi-pencil" class="p-button-rounded p-button-warning" rounded  @click="editarProducto(slotProps.data)" />
          <Button icon="pi pi-times" class="p-button-rounded p-button-danger" aria-label="Eliminar" @click="eliminarProducto(slotProps.data.id)" />
      </template>

    </Column>
    <template #footer>
      En total hay {{ products ? products.length : 0 }} productos.
    </template>
  </DataTable>


<Dialog v-model:visible="visible_img" modal header="Subir Imagen" :style="{ width: '50vw' }">
    <FileUpload name="demo[]" customUpload @uploader="subirImagen" @upload="onAdvancedUpload($event)" :multiple="false" accept="image/*" :maxFileSize="1000000">
      <template #empty>
          <p>Arrastre su imagen aqui.</p>
      </template>
  </FileUpload>
</Dialog>

</template>

<script setup>
import { ref } from "vue";
import productoService from "@/service/ProductoService";
import categoriaService from "@/service/CategoriaService";


const products = ref([]);
const dialogNuevoProducto = ref(false)
const product = ref({})
const categorias = ref([]);
const visible_img = ref(false) 
const id_producto = ref(-1)
const totalRecords = ref(0)
const loading = ref(false)
const lazyParams = ref({});

const abrirDialogProducto = () => {
    dialogNuevoProducto.value = true
}

const cerrarDialogProducto = () => {
    dialogNuevoProducto.value = false
}

const seleccionarImagen = (id) => {
  visible_img.value = true
  id_producto.value = id
}

const onPage = (event) => {
    lazyParams.value = event;
    loadLazyData();
};

const loadLazyData = async () => {
    loading.value = true;
    
    const {data} = await productoService.listar({ lazyEvent: JSON.stringify(lazyParams.value) })
    products.value = data.data;
    totalRecords.value = data.total;
    loading.value = false;

};

const listaProductos = async() => {
  loading.value = true;
    const {data} = await productoService.listar({ lazyEvent: JSON.stringify(lazyParams.value) });

    console.log(data.data)

    products.value = data.data;
   
}
const listaCategorias = async() => {
    const {data} = await categoriaService.listar();

    categorias.value = data
}



const subirImagen = async(event) => {
  console.log("Subiendo...", event.files)

  let fd = new FormData();
  fd.append('imagen', event.files[0])

  await productoService.guardarImagen(fd, id_producto.value);

  visible_img.value = false
  listaProductos()
}

listaProductos()
listaCategorias()
const guardarProducto = async () => {
  console.log(product.value)

  if(product.value.id){
    await productoService.modificar(product.value.id, product.value);

  }else{

    await productoService.guardar(product.value);
  }


    product.value = {} 
    listaProductos()
    cerrarDialogProducto()
}
const formatCurrency = (value) => {
    return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
};
</script>
