<template>
  <div class="container">
    <h2>Predicción de Demanda</h2>

    <div v-if="cargando">Cargando predicciones...</div>
    <div v-if="error">{{ error }}</div>

    <table v-if="predicciones.length">
      <thead>
        <tr>
          <th>Producto</th>
          <th>Demanda Estimada</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in predicciones" :key="item.producto_id">
          <td>{{ item.nombre }}</td>
          <td>{{ item.demanda }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const predicciones = ref([])
const cargando = ref(false)
const error = ref(null)

const obtenerPredicciones = async () => {
  cargando.value = true
  error.value = null

  try {
    const response = await axios.get('http://127.0.0.1:8001/prediccion')
    predicciones.value = response.data
  } catch (err) {
    error.value = 'Error al obtener predicciones'
    console.error(err)
  } finally {
    cargando.value = false
  }
}

onMounted(() => {
  obtenerPredicciones()
})
</script>

