<template>

    <Toast />

    <div class="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
        <div class="flex flex-column align-items-center justify-content-center">

            <div
                style="border-radius: 56px;
                padding:0.3rem;
                background: linear-gradient(180deg,var(--primary-color) 10%, rgba(33,150,243,0) 30%)">

                <div
                    class="w-full surface-card py-8 px-5 sm:px-8"
                    style="border-radius:53px">

                    <div class="text-center mb-5">
                        <img
                            src="https://d500.epimg.net/cincodias/imagenes/2015/05/08/pyme/1431098283_691735_1431098420_noticia_normal.jpg"
                            height="60">

                        <div class="text-900 text-3xl font-medium mb-3">
                            Crear Cuenta
                        </div>

                        <span class="text-600">
                            Complete la información para registrarse
                        </span>
                    </div>

                    <div>

                        <label class="block text-900 text-xl font-medium mb-2">
                            Nombre
                        </label>

                        <InputText
                            v-model="usuario.name"
                            class="w-full mb-4"
                            style="padding:1rem"
                            placeholder="Nombre completo"/>

                        <label class="block text-900 text-xl font-medium mb-2">
                            Correo
                        </label>

                        <InputText
                            v-model="usuario.email"
                            class="w-full mb-4"
                            style="padding:1rem"
                            placeholder="Correo electrónico"/>

                        <label class="block text-900 text-xl font-medium mb-2">
                            Contraseña
                        </label>

                        <Password
                            v-model="usuario.password"
                            class="w-full mb-4"
                            inputClass="w-full"
                            inputStyle="padding:1rem"
                            :toggleMask="true"/>

                        <label class="block text-900 text-xl font-medium mb-2">
                            Confirmar contraseña
                        </label>

                        <Password
                            v-model="usuario.c_password"
                            class="w-full mb-5"
                            inputClass="w-full"
                            inputStyle="padding:1rem"
                            :toggleMask="true"/>

                        <Button
                            label="Registrarse"
                            class="w-full p-3 text-xl"
                            @click="registrar"/>

                    </div>

                </div>

            </div>

        </div>
    </div>
</template>

<script setup>

import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import AuthService from '@/service/AuthService'

const router = useRouter()
const toast = useToast();
const usuario = reactive({
    name: '',
    email: '',
    password: '',
    c_password: ''
})

const registrar = async () => {

    try{
        await AuthService.registro(usuario)
        //alert("Usuario registrado correctamente.")
        //router.push('/login')
        toast.add({
            severity: 'success',
            summary: 'Registro exitoso',
            detail: 'El usuario fue registrado correctamente.',
            life: 3000
        });

        setTimeout(() => {
            router.push('/login');
        }, 1200);

    }catch(error){
        //console.log(error)
        //alert("No fue posible registrar el usuario.")
        console.log(error);
        let mensaje = "Ocurrió un error al registrar el usuario.";
        if(error.response?.data?.message){
            mensaje = error.response.data.message;
        }
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: mensaje,
            life: 4000
        });
    }

}

</script>