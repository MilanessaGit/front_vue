<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const totalProductos = ref(0)
const totalVentas = ref(0)

onMounted(async () => {
  try {
    const productos = await axios.get('http://127.0.0.1:8000/api/productos')
    totalProductos.value = productos.data.length

    const ventas = await axios.get('http://127.0.0.1:8000/api/ventas')
    totalVentas.value = ventas.data.length

  } catch (error) {
    console.error(error)
  }
})
</script>

<template>
  <div>
    <h1>Dashboard</h1>

    <div class="cards">
      <div class="card">
        <h3>Total Productos</h3>
        <p>{{ totalProductos }}</p>
      </div>

      <div class="card">
        <h3>Total Ventas</h3>
        <p>{{ totalVentas }}</p>
      </div>
    </div>
  </div>
</template>