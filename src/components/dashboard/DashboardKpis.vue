<template>

    <div class="grid">

        <div class="col-12 md:col-6 lg:col-3">
            <Card>
                <template #title>Productos</template>
                <template #content>
                    <h2>{{ kpis.total_productos }}</h2>
                </template>
            </Card>
        </div>

        <div class="col-12 md:col-6 lg:col-3">
            <Card>
                <template #title>Categorías</template>
                <template #content>
                    <h2>{{ kpis.total_categorias }}</h2>
                </template>
            </Card>
        </div>

        <div class="col-12 md:col-6 lg:col-3">
            <Card>
                <template #title>Clientes</template>
                <template #content>
                    <h2>{{ kpis.total_clientes }}</h2>
                </template>
            </Card>
        </div>

        <div class="col-12 md:col-6 lg:col-3">
            <Card>
                <template #title>Proveedores</template>
                <template #content>
                    <h2>{{ kpis.total_proveedores }}</h2>
                </template>
            </Card>
        </div>

        <div class="col-12 md:col-6 lg:col-3">
            <Card>
                <template #title>Empleados</template>
                <template #content>
                    <h2>{{ kpis.total_empleados }}</h2>
                </template>
            </Card>
        </div>

        <div class="col-12 md:col-6 lg:col-3">
            <Card>
                <template #title>Stock Total</template>
                <template #content>
                    <h2>{{ kpis.stock_total }}</h2>
                </template>
            </Card>
        </div>

        <div class="col-12 md:col-6 lg:col-3">
            <Card>
                <template #title>Ventas del Mes</template>
                <template #content>
                    <h2>Bs {{ Number(kpis.ventas_mes).toFixed(2) }}</h2>
                </template>
            </Card>
        </div>

        <div class="col-12 md:col-6 lg:col-3">
            <Card>
                <template #title>Compras del Mes</template>
                <template #content>
                    <h2>Bs {{ Number(kpis.compras_mes).toFixed(2) }}</h2>
                </template>
            </Card>
        </div>

        <div class="col-12 md:col-6 lg:col-3">
            <Card>
                <template #title>Stock Bajo</template>
                <template #content>
                    <h2>{{ kpis.productos_stock_bajo }}</h2>
                </template>
            </Card>
        </div>

    </div>

</template>

<script setup>
import Card from 'primevue/card'

    defineProps({
        kpis: {
            type: Object,
            required: true
        }
    })
</script>