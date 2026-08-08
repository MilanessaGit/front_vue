<template>
  <ProgressBar mode="indeterminate" style="height: 6px" v-if="mis_datos == null"></ProgressBar>

  <div class="card" v-else>
    <h1>Perfil</h1>

    <h3>Nombre: {{ mis_datos.user.name }}</h3>  <!-- .user.name -->
    <h3>Correo: {{ mis_datos.user.email }}</h3>
    <h3>Rol: {{ mis_datos.role.nombre }} </h3>
    <Button @click="salir">SALIR</Button>
  </div>
    <!--
    <div class="card">
        <div class="flex flex-wrap gap-8">
             <div class="flex-auto">
                <h5>Image</h5>
                
                <Avatar image="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png" class="mr-2" size="xlarge" shape="circle" />
                
            </div>
            
            <div class="flex-auto">
                <h5>Details</h5>
                <div class="flex flex-column gap-8">
                    <span class="font-bold">Name: {{ mis_datos.user.name }}</span>
                    <span class="font-bold">Email: {{ mis_datos.user.email }}</span>
                    <span class="font-bold">Role: {{ mis_datos.role.nombre }}</span>
                </div>
            </div>           
        </div>
        
    </div>
    <Button @click="salir">SALIR</Button>
    -->
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
      localStorage.removeItem("role");
      router.push({name: 'Login'}) // router redirecciona a /login
    } 

    perfil() // Hago funcionar la funcion-flecha perfil
    return {mis_datos, salir}
  }
}
</script>

