<script setup>
defineProps({
    fechaInicio: {
        type: Date,
        default: null,
    },
    fechaFin: {
        type: Date,
        default: null,
    },
    disabled: {
        type: Boolean,
        default: false,
    },
});

const emit = defineEmits(["update:fechaInicio", "update:fechaFin"]);
</script>

<template>
    <div class="col-12 md:col-3 field">
        <label for="reporte-fecha-inicio" class="block mb-2">Fecha inicial</label>
        <Calendar
            id="reporte-fecha-inicio"
            :modelValue="fechaInicio"
            :maxDate="fechaFin"
            :disabled="disabled"
            dateFormat="yy-mm-dd"
            showIcon
            class="w-full"
            @update:modelValue="emit('update:fechaInicio', $event)"
        />
    </div>

    <div class="col-12 md:col-3 field">
        <label for="reporte-fecha-fin" class="block mb-2">Fecha final</label>
        <Calendar
            id="reporte-fecha-fin"
            :modelValue="fechaFin"
            :minDate="fechaInicio"
            :disabled="disabled"
            dateFormat="yy-mm-dd"
            showIcon
            class="w-full"
            @update:modelValue="emit('update:fechaFin', $event)"
        />
    </div>
</template>
