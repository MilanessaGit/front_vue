

<template>
    <nav>
      <RouterLink to="/">INICIO</RouterLink> |
      <RouterLink to="/about">PERFIL</RouterLink>
    </nav>

  <RouterView />
</template>

<script setup>
  import { RouterLink, RouterView } from 'vue-router'
  // import HelloWorld from './components/HelloWorld.vue'
</script>
