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
        <Card class="dashboard-card">
            <template #title>
                <div class="section-title">
                    <i class="pi pi-exclamation-triangle"></i>
                    Productos con Stock Bajo
                </div>
            </template>

            <template #content>
                <div
                    v-for="producto in alerts.stock_bajo"
                    :key="producto.id"
                    class="alert-item stock"
                >

                    <div class="alert-header">
                        <i class="pi pi-box"></i>
                        <span class="alert-name">
                            {{ producto.nombre }}
                        </span>
                    </div>

                    <div class="alert-info">
                        <span>
                            Stock Actual
                        </span>

                        <strong>
                            {{ producto.stock_actual }}
                        </strong>
                    </div>

                    <div class="alert-info">
                        <span>
                            Stock Mínimo
                        </span>

                        <strong>
                            {{ producto.stock_minimo }}
                        </strong>
                    </div>

                </div>
                <div
                    v-if="alerts.stock_bajo.length===0"
                    class="empty-state"
                >
                    <i class="pi pi-check-circle"></i>
                    No existen productos con stock bajo.
                </div>
            </template>
        </Card>
    </div>

    <!-- PAGOS -->
    <div class="col-12 lg:col-6">

        <Card class="dashboard-card">
            <template #title>
                <div class="section-title">
                    <i class="pi pi-wallet"></i>
                    Pagos Pendientes
                </div>
            </template>

            <template #content>
                <div
                    v-for="pago in alerts.pagos_pendientes"
                    :key="pago.id"
                    class="alert-item payment"
                >
                    <div class="alert-header">
                        <i class="pi pi-building"></i>
                        <span class="alert-name">
                            {{ pago.nombre }}
                        </span>
                    </div>

                    <div class="payment-code">
                        {{ pago.codigo_entrada }}
                    </div>

                    <div class="payment-value">
                        Bs {{ Number(pago.pendiente).toFixed(2) }}
                    </div>
                </div>

                <div
                    v-if="alerts.pagos_pendientes.length===0"
                    class="empty-state"
                >
                    <i class="pi pi-check-circle"></i>
                    No existen pagos pendientes.
                </div>
            </template>
        </Card>
    </div>
</div>

</template>

<style scoped>

.section-title{
    display:flex;
    align-items:center;
    gap:.6rem;
    font-size:1.2rem;
    font-weight:700;
}

.alert-item{
    border-radius:12px;
    padding:1rem;
    margin-bottom:1rem;
    background:#f8fafc;
    transition:.25s;
}

.alert-item:hover{
    transform:translateY(-3px);
    box-shadow:0 8px 20px rgba(0,0,0,.08);
}

.stock{
    border-left:5px solid #ef4444;
}

.payment{
    border-left:5px solid #f59e0b;
}

.alert-header{
    display:flex;
    align-items:center;
    gap:.7rem;
    margin-bottom:.9rem;
    font-weight:700;
}

.alert-header i{
    font-size:1.2rem;
}

.alert-name{
    font-size:1rem;
}

.alert-info{
    display:flex;
    justify-content:space-between;
    margin-top:.3rem;
    color:#64748b;
}

.payment-code{
    color:#64748b;
    margin-bottom:.7rem;
}

.payment-value{
    color:#ef4444;
    font-size:1.35rem;
    font-weight:700;
}

.empty-state{
    text-align:center;
    color:#94a3b8;
    padding:2rem;
}

.empty-state i{
    display:block;
    font-size:2rem;
    margin-bottom:.8rem;
}

</style>