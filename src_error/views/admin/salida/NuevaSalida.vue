<template>
    <div class="card">
        <h2>Registro de Salida</h2>
        <div class="grid">
            <!-- Fecha -->
            <div class="col-12 md:col-6">
                <label class="font-bold mb-2 block">Fecha</label>
                <Calendar
                    v-model="salida.fecha"
                    disabled
                    showIcon
                    dateFormat="dd/mm/yy"
                    class="w-full"
                />
            </div>

            <!-- Empleado -->
            <div class="col-12 md:col-6">
                <label class="font-bold mb-2 block">Empleado</label>
                <Dropdown
                    v-model="salida.empleado_id"
                    :options="empleados"
                    optionLabel="nombre"
                    optionValue="id"
                    placeholder="Seleccione un empleado"
                    class="w-full"
                />
            </div>

            <!-- Tipo -->
            <div class="col-12 md:col-6">
                <label class="font-bold mb-2 block">Tipo de salida</label>
                <Dropdown
                    v-model="salida.tipo_salida"
                    :options="tiposSalida"
                    optionLabel="label"
                    optionValue="value"
                    placeholder="Seleccione un tipo"
                    class="w-full"
                />
            </div>

            <!-- Observación -->
            <div class="col-12">
                <label class="font-bold mb-2 block">Observación</label>
                <Textarea
                    v-model="salida.observacion"
                    rows="3"
                    class="w-full"
                />
            </div>
        </div>
    </div>


    <div class="card mt-4">
        <h3>Agregar Producto</h3>
        <div class="grid align-items-end">
            <!-- Producto -->
            <div class="col-12 md:col-6">
                <label class="font-bold mb-2 block">
                    Producto
                </label>
                <AutoComplete
                    v-model="productoSeleccionado"
                    :suggestions="productosFiltrados"
                    optionLabel="nombre"
                    @complete="buscarProductos"
                    forceSelection
                    placeholder="Escriba el nombre del producto"
                    class="w-full"
                />
            </div>
            <!-- Cantidad -->
            <div class="col-12 md:col-2">
                <label class="font-bold mb-2 block">
                    Cantidad
                </label>
                <InputNumber
                    v-model="cantidadSeleccionada"
                    :min="1"
                    class="w-full"
                />
            </div>
            <!-- Botón -->
            <div class="col-12 md:col-2">
                <Button
                    label="Agregar"
                    icon="pi pi-plus"
                    @click="agregarProducto"
                    class="w-full"
                />
            </div>
        </div>

        <!-- Información del producto -->
        <div v-if="productoSeleccionado" class="mt-3" >
            <Tag severity="info">
                Stock disponible:
                {{ productoSeleccionado.stock }}
                unidades
            </Tag>
        </div>
    </div>


    <div class="card mt-4">
        <h3>Detalle de Salida</h3>
        <DataTable
            :value="productosSalida"
            responsiveLayout="scroll"
            stripedRows
        >
            <Column
                field="nombre"
                header="Producto"
            />
            <Column
                field="cantidad"
                header="Cantidad"
            />
            <Column
                field="stock"
                header="Stock Disponible"
            />
            <Column
                header="Acciones"
            >
                <template #body="slotProps">
                    <Button
                        icon="pi pi-trash"
                        severity="danger"
                        text
                        @click="eliminarProducto(slotProps.index)"
                    />
                </template>
            </Column>
        </DataTable>
    </div>


    <div class="flex justify-content-end gap-2 mt-4">
        <Button
            label="Cancelar"
            severity="secondary"
        />
        <Button
            label="Registrar Salida"
            icon="pi pi-check"
            @click="guardar"
        />
    </div>
    
</template>

<script setup>
import { ref, onMounted } from "vue";
import authService from "@/service/AuthService";
import productoService from "@/service/ProductoService";
import empleadoService from "@/service/EmpleadoService";
import salidaService from "@/service/SalidaService";

//==============================
// Catálogos
//==============================

const empleados = ref([]);

const tiposSalida = ref([
    { label: "Robo", value: 1 },
    { label: "Pérdida", value: 2 },
    { label: "Deterioro", value: 3 },
    { label: "Ajuste Negativo", value: 4 }
]);

//==============================
// Formulario principal
//==============================

const salida = ref({
    fecha: new Date(),
    empleado_id: null,
    tipo_salida: null,
    observacion: ""
});

//==============================
// AutoComplete
//==============================

//Producto seleccionado actualmente
const productoSeleccionado = ref(null);

//Lista que mostrará el AutoComplete
const productosFiltrados = ref([]);

//Cantidad que desea sacar el usuario
const cantidadSeleccionada = ref(1);

//==============================
// Detalle de productos
//==============================

const productosSalida = ref([]);
const mis_datos = ref({});

onMounted(async () => {
    perfil();
    await cargarEmpleados();

});
const perfil = async() => {  
      const {data} = await authService.getPerfil(); 
      console.log(data.user.name, 'datos perfil')
      mis_datos.value = data
    }
const cargarEmpleados = async () => {
    try{
        const { data } = await empleadoService.listar();
        empleados.value = data.data;
    }catch(error){
        console.error(error);
    }
}

const buscarProductos = async (event) => {
    const texto = event.query;
     console.log("Texto buscado:", texto);
    if (!texto || texto.length < 2) {
        productosFiltrados.value = [];
        return;
    }
    try {
        const { data } = await productoService.buscar(texto, 5);
        console.log("Respuesta completa:", data);
        console.log("Productos encontrados:", data.data);
        productosFiltrados.value = data.data;
        console.log('productos filtrados value ---- ', productosFiltrados.value)
       
    } catch (error) {
        console.error("Error al buscar productos:", error);
        productosFiltrados.value = [];
    }
}

const agregarProducto = ()=>{
    if(!productoSeleccionado.value){
        return;
    }
    if(cantidadSeleccionada.value<=0){
        return;
    }

    //Buscar si el producto ya existe en la tabla
    const existente=productosSalida.value.find(
        p=>p.producto_id===productoSeleccionado.value.id );

    if(existente){
        existente.cantidad+=cantidadSeleccionada.value;
    }else{
        productosSalida.value.push({
            producto_id:productoSeleccionado.value.id,
            nombre:productoSeleccionado.value.nombre,
            stock:productoSeleccionado.value.stock,
            cantidad:cantidadSeleccionada.value
        });
    }
    limpiarFormularioProducto();
}

const limpiarFormularioProducto=()=>{
    productoSeleccionado.value=null;
    cantidadSeleccionada.value=1;
}

const eliminarProducto=(index)=>{
    productosSalida.value.splice(index,1);
}

const guardar=async()=>{
    if(productosSalida.value.length==0){
        return;
    }
    const datos={
        empleado_id:salida.value.empleado_id,
        tipo_salida:salida.value.tipo_salida,
        observaciones:salida.value.observacion,
        productos:productosSalida.value.map(producto=>({
            producto_id:producto.producto_id,
            cantidad:producto.cantidad
        }))
    };
    console.log(datos);
    await salidaService.guardar(datos);
}

</script>