<template>
    <div class="grid">

        <div class="col-12">
            <Card>
                <template #title> DATOS DE ENTRADA </template>
                <template #content>
                <p></p>
                </template>
            </Card>
        </div>
        

        <div class="col-7">
            <Card>
                <template #title> LOTES </template>
                <template #content>
                    <span class="p-input-icon-left">
                        <i class="pi pi-search" />
                        <!--<InputText v-model="buscar" placeholder="Buscar"
                            @keypress.enter="buscarProductos"/>  --> 
                            <!-- busca es variable y buscarProductos funcion-->
                    </span> 
                    <DataTable :value="lots" responsiveLayout="scroll">
                        <Column field="id" header="ID"></Column>
                        <Column field="codigo_lote" header="COD LOTE"></Column>
                        <Column field="cantidad" header="CANTIDAD"></Column>
                        <!-- Hacer la resta de cantidad cuando se de click en el boton  +  -->
                        <Column field="costo_unitario" header="COSTO_U"></Column>
                        <!--<Column field="producto.codigo_producto" header="PROD COD"></Column>-->

                        <Column field="producto.nombre" header="PROD NOM"></Column>
                        
                        <!-- Analizar xq me trae todos los atributos de Productos excepto categoria_id -->
                        <Column field="accion" header="GESTION">
                            <template #body="slotProps">
                                <Button
                                    icon="pi pi-plus"
                                    class="p-button-rounded p-button-success"
                                    aria-label="Eliminar"
                                    @click="addCarrito2(slotProps.data)"
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
                        <h5>CARRITO 2</h5>
                        <!--{{ carrito }}-->
                        <DataTable :value="carrito2" responsiveLayout="scroll">
                            <Column field="codigo_lote" header="COD LOT"></Column>
                            <Column field="cantidad" header="CANT"></Column>
                            <Column field="costo_unitario" header="COSTO_U"></Column>
                            <Column field="codigo_producto" header="COD PROD"></Column>
                            <Column field="nombre" header="NOMBRE PROD"></Column>
                            
                            <Column field="empleado_id" header="EMPLEADO ID"></Column>
                            
                            
                            <Column field="accion" header="ACCION"></Column>   
                        </DataTable>

                    </div>
                </div>

                <div class="col-12">
                    <div class="card">
                        <h5>PROVEEDOR</h5>
                            <span class="p-input-icon-left">
                            <i class="pi pi-search" />
                            <InputText v-model="buscar_prov" 
                                placeholder="Buscar por CI/NIT"
                                @keypress.enter="buscarProveedores"
                            /> <!-- busca es variable y buscarProductos funcion-->
                            </span> 
                                <Button label="Nuevo" icon="pi pi-external-link" @click="visible = true" />
                                {{ proveedor?.id?'':'PROVEEDOR NO ENCONTRADO' }}

                                <h4>PROVEEDOR: {{ proveedor.nombre }}  {{ proveedor.apellido }}</h4>
                                
                                <h4>CI/NIT: {{ proveedor.ci_nit }}</h4>
                    </div>
                </div>

                <div class="col-12">
                    <div class="card">
                        
                        <Button label="Guardar" icon="pi pi-check" class="p-button-text" @click="guardarEntrada"></Button>
                    </div>
                </div>  
                

            </div>
        </div> 

        
        <!--<div class="col-7">
            <Card>
                <template #title> PRODUCTOS </template>
                <template #content>
                    <span class="p-input-icon-left">
                        <i class="pi pi-search" />
                        <InputText v-model="buscar" placeholder="Buscar"
                            @keypress.enter="buscarProductos"
                        /> 
                    </span> 
                    <DataTable :value="products" responsiveLayout="scroll">
                        <Column field="id" header="ID"></Column>
                        <Column field="codigo_producto" header="COD"></Column>
                        <Column field="nombre" header="NOMBRE"></Column>
                        <Column field="precio_sugerido" header="PRECIO_S"></Column>
                        <Column field="categoria.nombre" header="CAT n"></Column>
                        
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
        </div>-->

        <!--    <div class="col-5">
            <div class="grid">
                <div class="col-12">
                    <div class="card">
                        <h5>CARRITO</h5>
                        {{ carrito }}
                        <DataTable :value="carrito" responsiveLayout="scroll">
                            <Column field="codigo_lote" header="COD LOT"></Column>
                            <Column field="codigo_producto" header="COD PROD"></Column>
                            <Column field="nombre" header="NOMBRE"></Column>
                            <Column field="precio_sugerido" header="PRECIO_S"></Column>
                            <Column field="empleado_id" header="EMPLEADO ID"></Column>
                            
                            
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
                            /> 
                            </span> 
                                <Button label="Nuevo" icon="pi pi-external-link" @click="visible = true" />
                                {{ cliente?.id?'':'CLiente No encotrado' }}

                                <h4>CLIENTE: {{ cliente.nombre }}  {{ cliente.apellido }}</h4>
                                
                                <h4>CI/NIT: {{ cliente.ci_nit }}</h4>
                    </div>
                </div>

                <div class="col-12">
                    <div class="card">
                        
                        <Button label="Guardar" icon="pi pi-check" class="p-button-text" @click="guardarVenta"></Button>
                    </div>
                </div>  

            </div>
        </div>   -->
    </div>


    <Dialog v-model:visible="visible" modal header="Nuevo Proveedor" :style="{ width: '50vw' }" class="p-fluid">
        <!--{{ product }} -->
        <div class="filed">
            <label for="nom">Ingrese Nombres</label>
            <InputText type="text" id="nom" v-model="proveedor.nombre" required autofocus  />
        </div>
        <div class="filed">
            <label for="nom">Ingrese Apellidos</label>
            <InputText type="text" id="ap" v-model="proveedor.apellido" required autofocus  />
        </div>
        <div class="filed">
            <label for="ci">Ingrese CI/NIT</label>
            <InputText type="text" id="ci" v-model="proveedor.ci_nit" required  />
        </div>
        <div class="filed">
            <label for="tel">TELEFONO</label>
            <InputText type="text" id="tel" v-model="proveedor.telefono"  />
        </div>
        <div class="filed">
            <label for="dir">DIRECCION</label>
            <InputText type="text" id="dir" v-model="proveedor.direccion"  />
        </div> 
        <template #footer>
            <Button label="Cancelar" icon="pi pi-times" class="p-button-text" @click="visible=false"></Button>
            <Button label="Guardar" icon="pi pi-check" class="p-button-text" @click="guardarProveedor"></Button>
        </template>
    </Dialog>


    <!--<div class="grid">
        <div class="col-12">
            <div class="card"><h5>hola</h5></div>
        </div>
        <div class="col-12">
            <div class="card"><h5>hola2</h5></div>
        </div>
        <div class="col-12">
            <div class="card"><h5>hola3</h5></div>
        </div>
    </div>-->
</template>   

<script setup>
import { onMounted, ref } from 'vue';
import loteService from '@/service/LoteService';
import productoService from '@/service/ProductoService';
import proveedorService from '@/service/ProveedorService';

//import empleadoService from '@/service/EmpleadoService';//rev no existe en el proyecto, revisar
import entradaService from '@/service/EntradaService';
import Column from 'primevue/column';
    const products = ref([]);
    const buscar = ref("");
    const carrito = ref([]);

    const buscar_prov = ref("");
    const proveedor = ref({});
    const empleado = ref({});
    const empleado_id = 1; // ** Revisar este campo cm referencia xq no existe en EMPLEADO, es un dato fijo por ahora para pruebas
    const visible = ref(false);

    const lots = ref([]);
    const carrito2 = ref([]);
    
    

    onMounted(async () => {
        // Para solo Productos
        //const {data} = await productoService.listar();
        //products.value = data.data; 

        //Lotes con  prod_id
        const {data} = await loteService.listar();
        lots.value = data.data; 
    })

    const buscarProductos = async() => {
        
        const {data} = await productoService.filtrar(buscar.value);
        console.log(data.data)
        products.value = data.data;     
    }

    const addCarrito2 = (lt) => {
        const {id, codigo_lote, costo_unitario, producto} = lt;
        //const c = 1;
        let l = {
            id: id,
            codigo_lote: codigo_lote,  
            cantidad: 1, // cada vez que se da click en el boton se agrega el producto al carrito2      
            costo_unitario: costo_unitario,
            codigo_producto: producto.codigo_producto,
            nombre : producto.nombre,

            //codigo_producto: lt.producto.codigo_producto, // REFERENCIA ** Revisar

             // ** Revisar este campo, esta solo cm referencia, no debe estar dentro de "l" LOTE, debe ser extraido de EMPLEADO O USER asi como CLIENTE lo hace 
            empleado_id : 1 // ** Revisar
        }
        carrito2.value.push(l);
    }
    // Esta funcion no se esta usando, esta como ejemplo para productos.
    const addCarrito = (prod) => {
        const {id, codigo_producto, nombre, precio_sugerido} = prod;
        let p = {
            id: id,
            codigo_lote: 1, // ** Revisar 
            codigo_producto: codigo_producto,
            nombre: nombre,
            precio_sugerido: precio_sugerido,
            cantidad: 1, // ** Revisar este campo cm referencia xq no existe en Producto
        }
        carrito.value.push(p);
    }

    const buscarProveedores = async() => {
        //llamar al servicio proveedor
        const { data } = await proveedorService.buscar(buscar_prov.value);
        proveedor.value = data
        console.log('buscar proveedores')
    }

    const guardarProveedor = async() => {
        //llamar al servicio proveedor
        const { data } = await proveedorService.guardar(proveedor.value);
        proveedor.value = data

        visible.value = false;
        //console.log('guardar clientes')
    }

    const guardarEntrada = async () => {
        const datos_ent = {
            proveedor_id: proveedor.value.id,
            empleado_id, //rev xq es fijo mas no es dinamico, revisar**
            lotes: carrito2.value, //carrito.value para productos
            
        } 
        const {data} =await entradaService.guardar(datos_ent)
    }

</script>