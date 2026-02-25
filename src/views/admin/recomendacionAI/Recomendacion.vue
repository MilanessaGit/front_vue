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
      const response = await axios.post(
        "http://localhost:8000/api/admin/recomendar",
        { producto_id: id }
      );

      this.recomendaciones = response.data;
    }
  }
};
</script>