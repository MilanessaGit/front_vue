<script setup>
import Card from 'primevue/card'

defineProps({
    activity: {
        type: Array,
        required: true
    }
})
</script>

<template>

<div class="grid">

    <div class="col-12">

        <Card>

            <template #title>
                Actividad Reciente
            </template>

            <template #content>

                <div
                    v-if="activity.length"
                    v-for="(item,index) in activity"
                    :key="index"
                    class="mb-3 border-bottom-1 surface-border pb-2"
                >

                    <strong>{{ item.tipo }}</strong>

                    <br>

                    {{ item.descripcion }}

                    <br>

                    <small>
                        {{ item.fecha }}
                    </small>

                </div>

                <div v-else>

                    Sin actividad reciente.

                </div>

            </template>

        </Card>

    </div>

</div>

</template>