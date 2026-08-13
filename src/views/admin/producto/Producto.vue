<template>

<Button v-if="puedeCrear" label="Nuevo producto" icon="pi pi-external-link" @click="abrirDialogProducto" />

<Dialog v-model:visible="dialogNuevoProducto" modal header="Nuevo Producto" :style="{ width: '50vw' }" class="p-fluid">
        <!--{{ product }}-->
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
      <label class="font-semibold mb-2 block">
          Categoría
      </label>

      <div class="formgrid grid">
          <label
              v-for="cat in categorias"
              :key="cat.id"
              :for="`categoria-${cat.id}`"
              class="col-12 md:col-6 flex align-items-center gap-2 mb-3 cursor-pointer"
          >
              <input
                  :id="`categoria-${cat.id}`"
                  v-model="product.categoria_id"
                  type="radio"
                  :value="cat.id"
                  style="width: 18px; height: 18px;"
              />

              <span>{{ cat.nombre }}</span>
          </label>
      </div>
    </div>
    
    
    <div class="formgrid grid">
        <div class="field col">
            <label for="pr">Precio</label>
            <InputNumber id="pr" v-model="product.precio_sugerido" mode="currency" currency="BOB" locale="es-BO" :minFractionDigits="2" :maxFractionDigits="2"></InputNumber>
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
    <!--{{ products }}-->
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
        
          :src="obtenerUrlImagen(slotProps.data.imagen)"
          :alt="slotProps.data.nombre || 'Imagen del producto'"
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

          <Button
            label="Similares"
            icon="pi pi-search"
            class="p-button-sm p-button-outlined p-button-info mr-2"
            :loading="cargando && productoConsultandoId === slotProps.data.id"
            @click="obtenerRecomendaciones(slotProps.data)"
          />

          <Button v-if="puedeEditar" icon="pi pi-pencil" class="p-button-rounded p-button-warning" rounded  @click="editarProducto(slotProps.data)" />
          <Button v-if="puedeEliminar" icon="pi pi-times" class="p-button-rounded p-button-danger" aria-label="Eliminar" @click="eliminarProducto(slotProps.data.id)" />
      </template>
    </Column>

    <template #footer>
      En total hay {{ totalRecords ? totalRecords : 0 }} productos. <!--Si existe totalRecords muestra sino pon 0 -->
    </template>
  </DataTable>


<!-- Recomendaciones KNN -->
<Dialog
  v-model:visible="dialogRecomendaciones"
  modal
  header="Productos similares"
  :style="{ width: '720px' }"
  :breakpoints="{ '960px': '85vw', '640px': '95vw' }"
>
  <div v-if="productoBaseRecomendacion" class="mb-4 p-3 surface-100 border-round">
    <div class="text-600 text-sm mb-1">Producto de referencia</div>
    <div class="font-semibold text-lg">{{ productoBaseRecomendacion.nombre }}</div>
    <div class="text-600 mt-1">
      {{ productoBaseRecomendacion.categoria?.nombre || 'Sin categoría' }}
      · {{ formatCurrency(Number(productoBaseRecomendacion.precio_sugerido || 0)) }}
    </div>
  </div>

  <div v-if="cargando" class="flex flex-column align-items-center justify-content-center py-5 gap-3">
    <i class="pi pi-spin pi-spinner text-3xl"></i>
    <span>Buscando productos similares...</span>
  </div>

  <div v-else-if="recomendaciones.length" class="grid">
    <div
      v-for="p in recomendaciones"
      :key="p.id"
      class="col-12 md:col-6"
    >
      <div class="surface-card border-1 surface-border border-round p-3 h-full">
        <div class="flex justify-content-between align-items-start gap-2 mb-2">
          <div>
            <div class="font-semibold text-lg">{{ p.nombre }}</div>
            <div class="text-600 text-sm">{{ p.codigo_producto }}</div>
          </div>
          <span class="knn-stock">Stock: {{ p.stock }}</span>
        </div>

        <div class="text-600 mb-2">
          {{ p.categoria?.nombre || 'Sin categoría' }}
        </div>

        <div class="font-semibold text-primary text-lg">
          {{ formatCurrency(Number(p.precio_sugerido || 0)) }}
        </div>
      </div>
    </div>
  </div>

  <div v-else class="text-center py-5 text-600">
    <i class="pi pi-info-circle text-3xl mb-3 block"></i>
    {{ mensajeRecomendacion || 'No se encontraron productos similares disponibles.' }}
  </div>

  <template #footer>
    <Button
      label="Cerrar"
      icon="pi pi-times"
      class="p-button-text"
      @click="dialogRecomendaciones = false"
    />
  </template>
</Dialog>


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
import recomendarService from "@/service/RecomendarService"

const products = ref([]);
const dialogNuevoProducto = ref(false)
const product = ref({})
const categorias = ref([]);
const visible_img = ref(false) 
const id_producto = ref(-1)
const totalRecords = ref(0)
const loading = ref(false)
const lazyParams = ref({});

const role = localStorage.getItem("role")
const esAdmin = role === 'admin';
const puedeCrear = role === 'admin' || role === 'supervisor'
const puedeEditar = role === 'admin' 
const puedeEliminar = role === 'admin'

const abrirDialogProducto = () => {
    product.value = {}
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

// productoService 
const listaProductos = async() => {
    loading.value = true;
    const {data} = await productoService.listar({ lazyEvent: JSON.stringify(lazyParams.value) });

    console.log(data.data)

    products.value = data.data;
    totalRecords.value = data.total;
    loading.value = false;
}
const editarProducto = (prod) => {

  product.value = prod

  dialogNuevoProducto.value = true

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

const eliminarProducto = async (id) => {

  if (id) {
    if(confirm("Esta seguro de eliminar el producto?")){
      loading.value = true;
      await productoService.eliminar(id);
      loading.value = false;
      loadLazyData()
    }

  }
}

const formatCurrency = (value) => {
  const numero = Number(value || 0)

  return new Intl.NumberFormat('es-BO', {
    style: 'currency',
    currency: 'BOB',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(numero)
}

// La URL de las imágenes utiliza el mismo servidor configurado para la API.
// Esto evita depender de 127.0.0.1 y permite visualizar imágenes desde celular.
const apiUrl = import.meta.env.VITE_API_URL || ''
const backendUrl = apiUrl.replace(/\/api\/?$/, '')

const obtenerUrlImagen = (imagen) => {
  if (!imagen) {
    return 'https://img.freepik.com/vector-premium/vector-icono-imagen-predeterminado-pagina-imagen-faltante-diseno-sitio-web-o-aplicacion-movil-no-hay-foto-disponible_87543-11093.jpg'
  }

  if (/^https?:\/\//i.test(imagen)) {
    return imagen
  }

  return `${backendUrl}/${String(imagen).replace(/^\/+/, '')}`
}



// =====================================
// Recomendaciones KNN
// =====================================
const recomendaciones = ref([])
const cargando = ref(false)
const dialogRecomendaciones = ref(false)
const mensajeRecomendacion = ref('')
const productoBaseRecomendacion = ref(null)
const productoConsultandoId = ref(null)

const obtenerRecomendaciones = async (productoSeleccionado) => {
  productoBaseRecomendacion.value = productoSeleccionado
  productoConsultandoId.value = productoSeleccionado.id
  recomendaciones.value = []
  mensajeRecomendacion.value = ''
  dialogRecomendaciones.value = true
  cargando.value = true

  try {
    const { data } = await recomendarService.obtener(productoSeleccionado.id)

    recomendaciones.value = Array.isArray(data.resultados)
      ? data.resultados
      : []

    mensajeRecomendacion.value = data.mensaje || ''
  } catch (error) {
    console.error('Error al obtener recomendaciones KNN:', error)

    recomendaciones.value = []
    mensajeRecomendacion.value =
      error?.response?.data?.mensaje ||
      'No se pudieron obtener las recomendaciones. Verifique que el servicio KNN esté disponible.'
  } finally {
    cargando.value = false
    productoConsultandoId.value = null
  }
}


</script>


<style scoped>
.knn-stock {
  display: inline-flex;
  align-items: center;
  white-space: nowrap;
  padding: 0.3rem 0.6rem;
  border-radius: 999px;
  background: var(--green-50);
  color: var(--green-700);
  font-size: 0.85rem;
  font-weight: 600;
}
</style>
