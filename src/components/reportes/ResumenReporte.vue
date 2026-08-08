<script setup>
defineProps({
    items: {
        type: Array,
        default: () => [],
    },
});
</script>

<template>
    <div class="grid resumen-reporte" aria-live="polite">
        <div
            v-for="item in items"
            :key="item.label"
            class="col-12 sm:col-6 lg:col-3"
        >
            <Card class="h-full">
                <template #content>
                    <div class="flex align-items-center justify-content-between gap-3">
                        <div>
                            <div class="text-600 text-sm mb-2">{{ item.label }}</div>
                            <div class="text-900 text-2xl font-semibold">{{ item.value }}</div>
                            <small v-if="item.detail" class="text-600">{{ item.detail }}</small>
                        </div>
                        <i v-if="item.icon" :class="[item.icon, 'text-2xl text-500']"></i>
                    </div>
                </template>
            </Card>
        </div>
    </div>
</template>

<style scoped>
.resumen-reporte :deep(.p-card-body),
.resumen-reporte :deep(.p-card-content) {
    height: 100%;
}
</style>
