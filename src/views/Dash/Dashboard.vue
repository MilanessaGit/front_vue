<script setup>
    import { ref, onMounted } from 'vue'
    import DashboardService from '@/service/DashboardService'

    import DashboardKpis from '@/components/dashboard/DashboardKpis.vue'
    import DashboardCharts from '@/components/dashboard/DashboardCharts.vue'
    import DashboardAlerts from '@/components/dashboard/DashboardAlerts.vue'
    import DashboardActivity from '@/components/dashboard/DashboardActivity.vue'

    const dashboard = ref(null)
    const loading = ref(true)

    const obtenerDashboard = async () => {
        try {
            console.log("obteniendo dashboard antes...")
            const response = await DashboardService.obtenerDashboard()

            console.log("respuesta: ", response)
            dashboard.value = response.data.data

            console.log("dashboard-->", dashboard.value)
        } catch (error) {
            console.error(error)
        } finally {
            console.log("entro al finally")
            loading.value = false
        }
    }

    onMounted(() => {
        obtenerDashboard()
    })
</script>

<template>
    <div class="card">
        <h2>Dashboard</h2>

        <div v-if="loading">
            Cargando dashboard...
        </div>

        <div v-else>
            <!--<pre>{{ dashboard }}</pre>-->
            <DashboardKpis
                v-if="dashboard && dashboard.kpis"
                :kpis="dashboard.kpis"
            />

            <DashboardCharts
                v-if="dashboard && dashboard.charts"
                :charts="dashboard.charts"
            />
            <DashboardAlerts
                :alerts="dashboard.alerts"
            />
            <DashboardActivity
                :activity="dashboard.activity"
            />
            
        </div>

    </div>
</template>