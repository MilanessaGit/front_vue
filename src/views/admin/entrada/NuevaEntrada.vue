<template>
    <div class="grid">

        <div class="col-12">
            <Card>
                <template #title> DATOS DE ENTRADA </template>
                <template #content>

                    <!--
                    <div><h3>Nombre: {{ mis_datos.user.name }} </h3> 
                        
                        <h3>Rol: {{ mis_datos.role.nombre }} </h3>
                    </div>
                    -->
                </template>    
            </Card>   
        </div>

        <div class="col-12">
            <Card>
                <template #content>
                    <p>Proveedores: </p> 
                    <div class="card flex justify-content">
                        <p>PROVEEDORES:   </p> <br>
                        <Dropdown v-model="selectedProv" :options="proovs" optionLabel="nombre" optionValue="id"  placeholder="Select a City" class="w-full md:w-14rem" />
                    </div>
                    <div class="card flex justify-content">
                        <p>FECHA: </p> <br>
                        <input type="text" v-model="fechaActual">
                    </div>
                </template>    
            </Card>    
        </div>

        <div class="col-12">
            <Card>
                <template #title> Detalle de Productos</template>
                <template #content>
                    <div class="card flex justify-content">
                        <p>PRODUCTO : </p> <br>
                        <Dropdown v-model="selectedProd" :options="products" optionLabel="nombre" optionValue="codigo_producto"  placeholder="Selecciona un producto" :virtualScrollerOptions="{ itemSize: 38 }" class="w-full md:w-14rem" />
                    </div>    
                    <div class="card flex justify-content">
                        <P>CANTIDAD : </P> <br> <InputNumber v-model.number="cant" /> <p></p>
                        </div>     
                        
                    <div class="card flex justify-content">
                        <P>PRECIO : </P> <br> <InputNumber v-model.number="precio" inputId="integeronly" /> <p></p>
                        </div>    
                        {{  cant }}
                        <Button label="Agregar" @click="addEntrada(selectedProv, selectedProd, cant, precio)" />


                        <Dialog v-model:visible="visible2" modal header="Agregar Producto" :style="{ width: '50vw' }" class="p-fluid">
                            <div class="filed">
                                <label for="nom">Nombre Proveedor</label>
                                <InputText type="text" id="nom" v-model="selectedProv" required autofocus  />
                            </div>
                            <div class="filed">
                                <label for="nom">Fecha</label>
                                <InputText type="text" id="ap" v-model="fechaActual" required autofocus  />
                            </div>
                            <div class="filed">
                                <label for="nom">Producto</label>
                                <InputText type="text" id="ap" v-model="selectedProd" required autofocus  />
                            </div>
                            <div class="filed">
                                <label for="nom">Cantidad: </label>
                                <InputText type="text" id="ap" v-model.number="cant" required autofocus  />
                            </div>
                            <div class="filed">
                                <label for="nom">Precio: </label>
                                <InputText type="text" id="ap" v-model.number="precio" required autofocus  />
                            </div>
                        </Dialog>   
                        
                    
                </template>    
            </Card>
        </div>

        <div class="col-12">
            <Card>
                <template #title> PRODUCTOS AGREGADOS</template>
                <template #content>
                    <span class="p-input-icon-left">
                        <i class="pi pi-search" />
                        <!--<InputText v-model="buscar" placeholder="Buscar"
                            @keypress.enter="buscarProductos"/>  --> 
                            <!-- busca es variable y buscarProductos funcion-->
                    </span> 
                    
                    <DataTable :value="detalleEntrada" responsiveLayout="scroll">
                        <Column field="selectedProv" header="PROVEEDOR"></Column>
                        <Column field="fechaActual" header="FECHA"></Column>
                        <Column field="selectedProd" header="PRODUCTO"></Column>
                        <!-- Hacer la resta de cantidad cuando se de click en el boton  +  -->
                        <Column field="cant" header="CANTIDAD"></Column>
                        <Column field="precio" header="PRECIO"></Column>
                        <!--<Column field="producto.codigo_producto" header="PROD COD"></Column>-->

                        
                        <!-- Analizar xq me trae todos los atributos de Productos excepto categoria_id -->
                        <Column field="accion" header="GESTION">
                        </Column>
                    </DataTable>
                    {{ detalleEntrada }}
                    <div class="col-12">
                    <div class="card">
                        
                        <Button label="Guardar Entrada" icon="pi pi-check" class="p-button-text" @click="guardarEntrada"></Button>
                    </div>
                </div> 

                </template>   
            </Card>
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
import authService from '@/service/AuthService';
import loteService from '@/service/LoteService';
import productoService from '@/service/ProductoService';
import proveedorService from '@/service/ProveedorService';
import categoriaService from '@/service/CategoriaService';
//import Dropdown from 'primevue/dropdown';

//import empleadoService from '@/service/EmpleadoService';//rev no existe en el proyecto, revisar
import entradaService from '@/service/EntradaService';
import Column from 'primevue/column';
import AuthService from '@/service/AuthService';

    const mis_datos = ref(null);
    const visible2 = ref(false);
    const detalleEntrada= ref([]);

    const selectedProv = ref(null);
    const proovs = ref([]);
    const lazyParams = ref({});
    const fechaActual = ref(new Date().toISOString().slice(0, 10)); // Obtener la fecha actual en formato YYYY-MM-DD
    const cant = ref(0);
    const precio = ref(0);
    
    const totalRecords = ref(0);
    const loading = ref(false);
    const selectedCate = ref(null);
    const cates = ref([]);

    const products = ref([]);
    const buscar = ref("");
    const carrito = ref([]);

    const buscar_prov = ref("");
    const proveedor = ref({});
    const prov = ref({});
    

    const empleado = ref({});
    const empleado_id = 1; // ** Revisar este campo cm referencia xq no existe en EMPLEADO, es un dato fijo por ahora para pruebas
    const visible = ref(false);

    const lots = ref([]);
    const carrito2 = ref([]);

    const selectedProd = ref(null);
    
    // Bloquear el campo de fecha para que no se pueda editar, ya que se obtiene la fecha actual del sistema
    //const fechaActual = ref(new Date().toISOString().slice(0, 10)); // Obtener la fecha actual en formato YYYY-MM-DD  
    
    //LiMPIAR EL FORMULARIO DESPUES DE GUARDAR LA ENTRADA, RESETEAR LOS CAMPOS Y EL DETALLE DE ENTRADA PARA QUE SE PUEDA REGISTRAR OTRA ENTRADA!!

    //VeER EL PRECIO DE COMPRA Y VER PRECIO VENTA SUGERIDO, PARA VER GANANCIAS!!!

    onMounted(async () => {
        
        const hoy = new Date()
        fechaActual.value = hoy.toISOString().split('T')[0]
        //getCategorias();
        cargarProveedores();
        cargarProductos();
        perfil()
        // Para solo Productos
        //const {data} = await productoService.listar();
        //products.value = data.data; 

        //Lotes con  prod_id
        const {data} = await loteService.listar();
        lots.value = data.data; 
        
    })

    const perfil = async() => {  
      const {data} = await authService.getPerfil();
      console.log(data.user.name, 'datos perfil')
      mis_datos.value = data
    }

    

    /*const getCategorias = async() => {
        try {
            const { data } = await categoriaService.listar();
            console.log(data);
            cates.value = data;
            
        } catch (error) {
            console.error('Error al listar categorias:', error);
        }
        
    }*/

    const buscarProductos = async() => {
        
        const {data} = await productoService.filtrar(buscar.value);
        console.log(data.data)
        products.value = data.data;     
    }

    const addEntrada = (selectedProv, selectedProd, cant, precio) => { //ent
        //const { selectedProv , fechaActual, selectedProd, cant, precio} = ent;
            let e = {
                selectedProv: selectedProv, //** */
                fechaActual: fechaActual,
                selectedProd: selectedProd,
                cant: cant,
                precio: precio,
            }
            console.log(e,'Dentrada')
            console.log(e.selectedProv, '---SELECTprovv----')
            console.log(e.selectedProd, '---SELECTprod----')
            detalleEntrada.value.push(e);
           //console.log(detalleEntrada.value.map(p => p.selectedProd),' ---detalle entrada --------'); // muestra Como array
            console.log(typeof detalleEntrada.value[0].precio, ': Vector detalle entrada') // muestra el tipo
    }

    const guardarEntrada = async () => {
        let p_total = 0;
        
        let producto = selectedProd.value;
        // VER LA CREACION DE LOTE PARA VER LA CREACION DE ENTRADA 
        //let f_caducidad = null;
        let estado = 1; // Disponible por defecto
        let lot = {

            cantidad: detalleEntrada.value[0].cant,
            fecha_ingreso: detalleEntrada.value[0].fechaActual,
            costo_unitario: detalleEntrada.value[0].precio,
            codigo_producto: detalleEntrada.value[0].selectedProd, //LLAVE FORANEA
            estado: estado
        }
        console.log(typeof lot.costo_unitario,' : Tipo costo unitario');
        
        const datos_ent = {
            
            // FECHA => SE PUEDE SACAR DEL BACKEND LA FECHA ACTUAL

            proveedor_id: detalleEntrada.value[0].selectedProv, //LLAVE FORANEA
            empleado_id, //REVISAR xq es fijo mas no es dinamico, LLAVE FORANEA
            p_total: detalleEntrada.value[0].cant * detalleEntrada.value[0].precio, // !!! Esta GUARDADO COMO VECTOR CORREGIR PARA QUE SEA UN NUMERO

            
             
            lot // OBJETO LOTE, PARA REGISTRAR EN BACKEND
        } 
        const {data} =await entradaService.guardar(datos_ent)
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
    
    const cargarProveedores = async() => {
        const params = {
            lazyEvent: JSON.stringify({
            page: 0,
            rows: 100
            })
        }
        const { data } = await proveedorService.listar(params);
        console.log(data.data,'data proveedores');
        proovs.value = data.data
    }
    const cargarProductos = async() => {
        const {data} = await productoService.listar();
        console.log(data.data,'data productos')
        products.value = data.data; 
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

    

</script>