<template>
  {{ ventas }}
</template>
<script setup>
import ventaService from "@/service/VentaService";
import { ref } from "vue";

let ventas = ref([]);
let visible = ref(false);

let lotesDT = ref([]);

async function getVentas() {
  const { data } = await ventaService.listar();

  ventas.value = data.data;
}

async function verLotes(lotes){
    visible.value = true
    lotesDT.value = lotes
}

getVentas();
</script>