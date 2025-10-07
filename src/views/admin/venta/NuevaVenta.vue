<template>
    <div class="grid">

        <div class="col-12">
            <Card>
                <template #title> DATOS DE PEDIDO </template>
                <template #content>
                <p></p>
                </template>
            </Card>
        </div>
        <div class="col-7">
            <Card>
                <template #title> PRODUCTOS </template>
                <template #content>
                    <span class="p-input-icon-left">
                        <i class="pi pi-search" />
                        <InputText v-model="buscar" placeholder="Buscar"
                            @keypress.enter="buscarProductos"
                        /> <!-- busca es variable y buscarProductos funcion-->
                    </span> 
                    <DataTable :value="products" responsiveLayout="scroll">
                        <Column field="id" header="ID"></Column>
                        <Column field="codigo_producto" header="COD"></Column>
                        <Column field="nombre" header="NOMBRE"></Column>
                        <Column field="precio_sugerido" header="PRECIO_S"></Column>
                        <!--<Column field="stock" header="CANT"></Column>-->
                        <Column field="accion" header="GESTION">
                            <template #body="slotProps">
                                <Button
                                    icon="pi pi-plus"
                                    class="p-button-rounded p-button-success"
                                    aria-label="Eliminar"
                                    @click="addCarrito(slotProps.data)"
                                /> 
                            </template>
                        </Column>
                    </DataTable>
                </template>
            
            </Card>
        </div>

        <div class="col-5">
            <div class="grid">
                <div class="col-12">
                    <div class="card">
                        <h5>CARRITO</h5>
                        <!--{{ carrito }}-->
                        <DataTable :value="carrito" responsiveLayout="scroll">
                            <Column field="codigo_lote" header="COD LOT"></Column>
                            <Column field="nombre" header="NOMBRE"></Column>
                            <!--costo_unitario--><Column field="precio_sugerido" header="PRECIO_S"></Column>
                            <!--<Column field="cantidad" header="CANT"></Column>-->
                            <Column field="accion" header="ACCION"></Column>   
                        </DataTable>

                    </div>
                </div>
                <div class="col-12">
                    <div class="card">
                        <h5>CLIENTE</h5>
                            <span class="p-input-icon-left">
                            <i class="pi pi-search" />
                            <InputText v-model="buscar_clie" 
                                placeholder="Buscar por CI/NIT"
                                @keypress.enter="buscarClientes"
                            /> <!-- busca es variable y buscarProductos funcion-->
                            </span> 
                                <Button label="Nuevo" icon="pi pi-external-link" @click="visible = true" />
                                {{ cliente?.id?'':'CLiente No encotrado' }}

                                <h4>CLIENTE: {{ cliente.nombre }}  {{ cliente.apellido }}</h4>
                                
                                <h4>CI/NIT: {{ cliente.ci_nit }}</h4>
                    </div>
                </div>

                <div class="col-12">
                    <div class="card">
                        <h5>GUARDAR VENTA</h5>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.</p>
                    </div>
                </div>  

            </div>
        </div>   
    </div>


    <Dialog v-model:visible="visible" modal header="Nuevo Cliente" :style="{ width: '50vw' }" class="p-fluid">
        <!--{{ product }} -->
        <div class="filed">
            <label for="nom">Ingrese Nombres</label>
            <InputText type="text" id="nom" v-model="cliente.nombre" required autofocus  />
        </div>
        <div class="filed">
            <label for="nom">Ingrese Apellidos</label>
            <InputText type="text" id="ap" v-model="cliente.apellido" required autofocus  />
        </div>
        <div class="filed">
            <label for="ci">Ingrese CI/NIT</label>
            <InputText type="text" id="ci" v-model="cliente.ci_nit" required  />
        </div>
        <div class="filed">
            <label for="tel">TELEFONO</label>
            <InputText type="text" id="tel" v-model="cliente.telefono"  />
        </div>
        <div class="filed">
            <label for="dir">DIRECCION</label>
            <InputText type="text" id="dir" v-model="cliente.direccion"  />
        </div> 
        <template #footer>
            <Button label="Cancelar" icon="pi pi-times" class="p-button-text" @click="visible=false"></Button>
            <Button label="Guardar" icon="pi pi-check" class="p-button-text" @click="guardarCliente"></Button>
        </template>
    </Dialog>


    <div class="grid">
        <div class="col-12">
            <div class="card"><h5>hola</h5></div>
        </div>
        <div class="col-12">
            <div class="card"><h5>hola2</h5></div>
        </div>
        <div class="col-12">
            <div class="card"><h5>hola3</h5></div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import productoService from '@/service/ProductoService';
import clienteService from '@/service/ClienteService';
import Column from 'primevue/column';
    const products = ref([]);
    const buscar = ref("");
    const carrito = ref([]);
    const buscar_clie = ref("");
    const cliente = ref({});
    const visible = ref(false);
    
    

    onMounted(async () => {
        const {data} = await productoService.listar();
        products.value = data.data; 
    })

    const buscarProductos = async() => {
        
        const {data} = await productoService.filtrar(buscar.value);
        console.log(data.data)
        products.value = data.data;     
    }

    const addCarrito = (prod) => {
        const {id, codigo_producto, nombre, precio_sugerido} = prod;

        let p = {
            id: id,
            codigo_producto: codigo_producto,
            nombre: nombre,
            precio_sugerido: precio_sugerido,
            cantidad: 1 // ** Revisar este campo cm referencia xq no existe en Producto
        }
        carrito.value.push(p);

    }

    const buscarClientes = async() => {
        //llamar al servicio cliente
        const { data } = await clienteService.buscar(buscar_clie.value);
        cliente.value = data
        console.log('buscar clientes')
    }

    const guardarCliente = async() => {
        //llamar al servicio cliente
        const { data } = await clienteService.guardar(cliente.value);
        cliente.value = data
        visible.value = false;
        //console.log('guardar clientes')
    }

</script>