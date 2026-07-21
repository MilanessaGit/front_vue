<script setup>
import { ref, watch } from 'vue'
import Card from 'primevue/card'
import Chart from 'primevue/chart'


const props = defineProps({
    charts: {
        type: Object,
        required: true
    }
})

const ventasSemanaData = ref({})
const ventasSemanaOptions = ref({})
const ventasMesData = ref({})
const ventasMesOptions = ref({})

const categoriaData = ref({})
const categoriaOptions = ref({})

const vendidosData = ref({})
const vendidosOptions = ref({})

watch(
    () => props.charts,
    () => {

        ventasSemanaData.value = {
            labels: props.charts.ventas_semana.labels,
            datasets: [
                {
                    label: props.charts.ventas_semana.datasets[0].label,
                    data: props.charts.ventas_semana.datasets[0].data,
                    tension: 0.4,
                    fill: false
                }
            ]
        }
        ventasSemanaOptions.value = {
            responsive: true,
            maintainAspectRatio: false
        }

        // Ventas por mes
        ventasMesData.value = {
            labels: props.charts.ventas_mes.labels,
            datasets: [
                {
                    label: props.charts.ventas_mes.datasets[0].label,
                    data: props.charts.ventas_mes.datasets[0].data
                }
            ]
        }

        ventasMesOptions.value = {
            responsive: true,
            maintainAspectRatio: false
        }

        // Productos por categoría
        categoriaData.value = {
            labels: props.charts.productos_categoria.labels,
            datasets: [
                {
                    data: props.charts.productos_categoria.datasets[0].data
                }
            ]
        }

        categoriaOptions.value = {
            responsive: true,
            maintainAspectRatio: false
        }
        
        // Productos más vendidos
        vendidosData.value = {
            labels: props.charts.productos_mas_vendidos.labels,
            datasets: [
                {
                    label: props.charts.productos_mas_vendidos.datasets[0].label,
                    data: props.charts.productos_mas_vendidos.datasets[0].data
                }
            ]
        }

        vendidosOptions.value = {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false
        }

    },
    { immediate: true }
)
</script>

<template>

    <div class="grid">

        <!-- Ventas Semana -->
        <div class="col-12 lg:col-6">
            <Card>
                <template #title>Ventas por Semana</template>

                <template #content>
                    <div style="height:320px">
                        <Chart
                            type="line"
                            :data="ventasSemanaData"
                            :options="ventasSemanaOptions"
                        />
                    </div>
                </template>
            </Card>
        </div>

        <!-- Ventas Mes -->
        <div class="col-12 lg:col-6">
            <Card>
                <template #title>Ventas por Mes</template>

                <template #content>
                    <div style="height:320px">
                        <Chart
                            type="bar"
                            :data="ventasMesData"
                            :options="ventasMesOptions"
                        />
                    </div>
                </template>
            </Card>
        </div>

        <!-- Categorías -->
        <div class="col-12 lg:col-6">
            <Card>
                <template #title>Productos por Categoría</template>

                <template #content>
                    <div style="height:320px">
                        <Chart
                            type="doughnut"
                            :data="categoriaData"
                            :options="categoriaOptions"
                        />
                    </div>
                </template>
            </Card>
        </div>

        <!-- Más vendidos -->
        <div class="col-12 lg:col-6">
            <Card>
                <template #title>Productos Más Vendidos</template>

                <template #content>
                    <div style="height:320px">
                        <Chart
                            type="bar"
                            :data="vendidosData"
                            :options="vendidosOptions"
                        />
                    </div>
                </template>
            </Card>
        </div>

    </div>

</template>