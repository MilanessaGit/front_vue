<script setup>
import Card from 'primevue/card'

defineProps({
    kpis: {
        type: Object,
        required: true
    }
})

const cards = [

{
    titulo:'Productos',
    valor:'total_productos',
    icono:'pi pi-box',
    color:'#2563EB',
    fondo:'#DBEAFE'
},

{
    titulo:'Categorías',
    valor:'total_categorias',
    icono:'pi pi-tags',
    color:'#2563EB',
    fondo:'#BFDBFE'
},

{
    titulo:'Clientes',
    valor:'total_clientes',
    icono:'pi pi-users',
    color:'#7C3AED',
    fondo:'#E9D5FF'
},

{
    titulo:'Proveedores',
    valor:'total_proveedores',
    icono:'pi pi-truck',
    color:'#EA580C',
    fondo:'#FED7AA'
},

{
    titulo:'Empleados',
    valor:'total_empleados',
    icono:'pi pi-id-card',
    color:'#7C3AED',
    fondo:'#DDD6FE'
},

{
    titulo:'Stock Total',
    valor:'stock_total',
    icono:'pi pi-shopping-cart',
    color:'#15803D',
    fondo:'#BBF7D0'
},

{
    titulo:'Ventas del Mes',
    valor:'ventas_mes',
    icono:'pi pi-chart-line',
    color:'#15803D',
    fondo:'#86EFAC',
    moneda:true
},

{
    titulo:'Compras del Mes',
    valor:'compras_mes',
    icono:'pi pi-shopping-bag',
    color:'#EA580C',
    fondo:'#FDBA74',
    moneda:true
},

{
    titulo:'Stock Bajo',
    valor:'productos_stock_bajo',
    icono:'pi pi-exclamation-triangle',
    color:'#DC2626',
    fondo:'#FECACA'
}

]
</script>

<template>

    <div class="grid">

        <div
            class="col-12 md:col-6 xl:col-4"
            v-for="card in cards"
            :key="card.valor"
        >

            <Card
                class="dashboard-card"
                :style="{
                    background: card.fondo
                }"
            >
                <template #content>
                    <div class="card-content">
                        <div>
                            <div class="card-title">
                                {{ card.titulo }}
                            </div>
                            <div
                                class="card-value"
                                :style="{ color: card.color }"
                            >
                                <template v-if="card.moneda">
                                    Bs {{ Number(kpis[card.valor]).toFixed(2) }}
                                </template>

                                <template v-else>
                                    {{ kpis[card.valor] }}
                                </template>
                            </div>
                        </div>

                        <div
                            class="icon-box"
                            :style="{
                            backgroundColor: card.color,
                            color: '#fff'
                        }"
                        >
                            <i class="pi"
                                :class="card.icono">
                            </i>
                        </div>
                    </div>
                </template>
            </Card>

        </div>
    </div>
</template>

<style scoped>

.dashboard-card{
    border:none;
    border-radius:18px;
    box-shadow:
        0 6px 20px rgba(15,23,42,.08);
}

.dashboard-card:hover{
    transform:translateY(-6px);
    box-shadow:
        0 18px 35px rgba(0,0,0,.14);
}

.card-content{
    display:flex;
    justify-content:space-between;
    align-items:center;
}

.card-title{
    font-size:1rem;
    font-weight:600;
    color:#64748B;
}

.card-value{
    font-size:2.3rem;
    font-weight:700;
    color:#e1e8f5;
}

.icon-box{
    width:70px;
    height:70px;
    border-radius:16px;
    display:flex;
    justify-content:center;
    align-items:center;
    font-size:2rem;
}

</style>