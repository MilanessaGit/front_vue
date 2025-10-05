<template>
    <div class="grid">

        <div class="col-12">
            <div class="card">
                <h2>DATOS DE LA VENTA</h2>
            </div>
        </div>
        <div class="col-7">
            <div class="card">
                <h5>Productos</h5>
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
            
            </div>
        </div>
        <div class="col-5">
            <div class="grid">
                <div class="col-12">
                    <div class="card">
                        <h5>CARRITO</h5>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.</p>
                    </div>
                </div>
                <div class="col-12">
                    <div class="card">
                        <h5>CLIENTE</h5>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.</p>
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
    const products = ref([]);

    onMounted(async () => {
        const {data} = await productoService.listar();
        products.value = data.data; 
    })
</script>