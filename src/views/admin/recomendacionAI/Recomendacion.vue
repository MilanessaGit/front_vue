<template>
  <div>
    <h2>Productos</h2>

    <button @click="verRecomendaciones(1)">
      Ver recomendaciones
    </button>

    <h3>Recomendados</h3>

    <ul>
      <li v-for="item in recomendaciones" :key="item.id">
        Producto {{ item.id }}
        — Precio: {{ item.precio_sugerido }}
        — Stock: {{ item.stock_total }}
      </li>
    </ul>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      recomendaciones: []
    };
  },
  methods: {
    async verRecomendaciones(id) {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await axios.post(
        `${API_URL}/admin/recomendar`,
        { producto_id: id }
      );

      this.recomendaciones = response.data;
    }
  }
};
</script>