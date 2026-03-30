<template>
  <ProgressBar mode="indeterminate" style="height: 6px" v-if="mis_datos == null"></ProgressBar>
  <div class="card" v-else>
    
    <h1>Perfil</h1>

    <h3>Nombre: {{ mis_datos.user.name }}</h3>  <!-- .user.name -->
    <h3>Correo: {{ mis_datos.user.email }}</h3>
    <h3>Rol: {{ mis_datos.role.nombre }} </h3>
    <Button @click="salir">SALIR</Button>
  </div>
</template>

<script>
import authService from '@/service/AuthService';
import { ref } from 'vue';
import { useRouter } from 'vue-router'

export default {
  setup() {
    const router = useRouter()
    const mis_datos = ref(null) // Si usamos ref , entonces para acceder a los valores d objeto usamos .value

    const perfil = async() => {  
      const {data} = await authService.getPerfil();
      mis_datos.value = data
    }

    const salir = async() => {
      await authService.logout();
      localStorage.removeItem("access_token");
      router.push({name: 'Login'}) // router redirecciona a /login
    } 

    perfil() // Hago funcionar la funcion-flecha perfil
    return {mis_datos, salir}
  }
}
</script>

