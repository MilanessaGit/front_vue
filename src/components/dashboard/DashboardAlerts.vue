<script setup>
import Card from 'primevue/card'

defineProps({
    alerts: {
        type: Object,
        required: true
    }
})
</script>

<template>

<div class="grid">

    <!-- STOCK BAJO -->

    <div class="col-12 lg:col-6">

        <Card>

            <template #title>
                Productos con Stock Bajo
            </template>

            <template #content>

                <div
                    v-if="alerts.stock_bajo.length"
                    v-for="producto in alerts.stock_bajo"
                    :key="producto.id"
                    class="mb-3"
                >

                    <strong>{{ producto.nombre }}</strong>

                    <br>

                    Stock:

                    {{ producto.stock_actual }}

                    /

                    Mínimo:

                    {{ producto.stock_minimo }}

                </div>

                <div v-else>

                    No existen productos con stock bajo.

                </div>

            </template>

        </Card>

    </div>



    <!-- PAGOS -->

    <div class="col-12 lg:col-6">

        <Card>

            <template #title>
                Pagos Pendientes
            </template>

            <template #content>

                <div
                    v-if="alerts.pagos_pendientes.length"
                    v-for="pago in alerts.pagos_pendientes"
                    :key="pago.id"
                    class="mb-3"
                >

                    <strong>{{ pago.nombre }}</strong>

                    <br>

                    Entrada:

                    {{ pago.codigo_entrada }}

                    <br>

                    Pendiente:

                    Bs {{ Number(pago.pendiente).toFixed(2) }}

                </div>

                <div v-else>

                    No existen pagos pendientes.

                </div>

            </template>

        </Card>

    </div>

</div>

</template>