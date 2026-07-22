<script setup>
import Card from 'primevue/card'
import Tag from 'primevue/tag'

defineProps({
    activity: {
        type: Array,
        required: true
    }
})

const obtenerIcono = (tipo) => {
    switch (tipo) {
        case 'Venta':
            return 'pi pi-shopping-cart'

        case 'Compra':
            return 'pi pi-box'

        default:
            return 'pi pi-clock'
    }
}

const obtenerColor = (tipo) => {
    switch (tipo) {
        case 'Venta':
            return 'success'

        case 'Compra':
            return 'info'

        default:
            return 'secondary'
    }
}
</script>

<template>

<Card class="dashboard-card">

    <template #title>

        <div class="flex align-items-center gap-2">
            <i class="pi pi-history"></i>
            <span>Actividad Reciente</span>
        </div>

    </template>

    <template #content>

        <div
            v-if="activity.length"
            class="activity-list"
        >

            <div
                v-for="item in activity"
                :key="item.codigo"
                class="activity-item"
            >

                <div class="activity-icon">
                    <i
                        class="pi"
                        :class="obtenerIcono(item.tipo)"
                    ></i>
                </div>

                <div class="activity-content">
                    <div class="flex justify-content-between align-items-center">
                        <strong>
                            {{ item.descripcion }}
                        </strong>
                        <Tag
                            :value="item.tipo"
                            :severity="obtenerColor(item.tipo)"
                        />
                    </div>

                    <small class="activity-date">
                        {{ item.fecha }}
                    </small>
                </div>
            </div>
        </div>

        <div
            v-else
            class="text-center text-color-secondary py-4"
        >
            No existe actividad reciente.
        </div>
    </template>
</Card>

</template>

<style scoped>

.activity-list{
    display:flex;
    flex-direction:column;
    gap:1rem;
}

.activity-item{
    display:flex;
    gap:1rem;
    padding:1rem;
    border-radius:12px;
    transition:.25s;
    border:1px solid #edf2f7;
}

.activity-item:hover{
    background:#f8fafc;
    transform:translateY(-2px);
}

.activity-icon{
    width:48px;
    height:48px;
    border-radius:50%;
    background:#dbeafe;
    color:#2563eb;
    display:flex;
    align-items:center;
    justify-content:center;
    font-size:1.2rem;
    flex-shrink:0;
}

.activity-content{
    flex:1;
}

.activity-date{
    color:#64748b;
}

</style>