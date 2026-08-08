<template>
    <div>
        <h1>{{ titulo }}</h1>
        
        <label for="">Nombre: </label>
        <input type="text" v-model="usuario.name" required>
        {{ errors?.name }}  <!-- ? = en caso de q pueda o no existir valor en el objeto errors -->
        <br>
        <label for="">Email: </label>
        <input type="email" v-model="usuario.email" required>
        {{ errors?.email }}
        <br>
        <label for="">Password: </label>
        <input type="password" v-model="usuario.password" required>
        {{ errors?.password }}
        <br>

        <button @click="guardarUsuario()">{{ usuario.id?'Modificar Usuario':'Guardar Usuario' }}</button>
        <button type="button" @click="resetForm()">Reset</button>

    <!-- Lista de Usuarios-->
    <input type="search" v-model="buscar" @keypress.enter="listarUsuarios()">

    
    <Button label="Nuevo" icon="pi pi-external-link" @click="openModalNuevoUsuario" />

    <Dialog  v-model:visible="displayModal" :breakpoints="{'20px': '45vw', '40px': '50vw'}" :style="{width: '250px'}" :modal="true" header="Nuevo Usuario" class="p-fluid">
    
    <InputText id="nom" type="text" v-model="usuario.name" />

    <InputText id="em" type="email" v-model="usuario.email" />

    <InputText id="pas" type="password" v-model="usuario.password" />

    <template #footer>
        <Button label="No" icon="pi pi-times" @click="closeModal" class="p-button-text"/>
        <Button label="Yes" icon="pi pi-check" @click="guardarUsuario" autofocus />
    </template>
</Dialog>
 
    <DataTable :value="usuarios" tableStyle="min-width: 50rem"> <!-- COMO OPCION:  responsiveLayout="scroll"-->
        <Column field="id" header="ID"></Column>
        <Column field="name" header="Name"></Column>
        <Column field="email" header="Email"></Column>
        <Column field="created_at" header="Creado en"></Column>
        
    </DataTable>

        <table border="1">
            <tr>
                <td>ID</td>
                <td>NOMBRE</td>
                <td>CORREO</td>
                <td>CREADO EN</td>
                <td>ACCION</td>
            </tr>
            <tr v-for="u in usuarios" :key="u.id"> <!-- para que su fila sea unica, no se repita los id su llave, sus numeros de lista -->
                <td>{{ u.id }}</td>
                <td>{{ u.name }}</td>
                <td>{{ u.email }}</td>
                <td>{{ u.created_at }}</td>
                <td>
                    <button @click="editarUsuario(u)">Editar</button>
                    <button @click="eliminar(u.id, u.name)">Eliminar X</button>
                </td>
            </tr>

        </table>


        <!-- // <pre> {{ usuarios }} </pre>   //Visualiza mejor los datos  -->
    </div>
</template>

<script>
import usuarioService from "@/service/UsuarioService";
import { ref } from "vue";
import Dialog from 'primevue/dialog';

export default {
    setup() {
        // variables
        const titulo = "Gestión de Usuarios";
        const usuarios = ref([]) //array
        const usuario = ref({name: "", email: "", password: ""});  // object (nuevo usuario), se enviara al metodo guardarUsuario()
        const errors = ref(null)
        const buscar = ref('')

        const displayModal = ref(false);
        
        //methods
        const listarUsuarios = async () => {
            const {data} = await usuarioService.listar(buscar.value);    // {data} es la respuesta del servidor 
            usuarios.value = data // .value hace referencia a ref (reactivo), ver en la consola web: value
        }
        
        listarUsuarios();

        const guardarUsuario = async () => {
            
            try {
                if (usuario.value.id) {
                    // modificar
                    const {data} = await usuarioService.modificar(usuario.value.id, usuario.value);
                    listarUsuarios();
                    resetForm()
                } else {
                    const {data} = await usuarioService.guardar(usuario.value); //{} ayuda q sea reactivo y se observe en los cambios
                    console.log(data); // la data es la respuesta del servidor
                    //listarUsuarios();
                    usuarios.value.push(data.data); // agregamos al array usuarios, accedemos a .data de la respuesta del servidor para agregar 
                    resetForm()
                }
                
            } catch (error) {
                console.log(error.response.data);
                errors.value = error.response.data.errors;
            }
        }
        
        const editarUsuario = (u) => { // se captura de u todo menos el password, x el servidor y tmb esta cifrado
            let {name, email, id} = u // de todo lo q tiene u solo sacamos por parametros lo q no interesa
            usuario.value = {name , email, id}
        }
        
        const resetForm = () => {
            usuario.value.id = null;
            usuario.value = {name: "", email: "", password: ""};
        }

        const eliminar = async (id, name) => {
            if(confirm(`Esta seguro de eliminar al usuario: ${name} ?`)){
                const {data} = await usuarioService.eliminar(id);
            
                listarUsuarios();
            }
        }

        const openModalNuevoUsuario = () =>{
            displayModal.value =true;
        }

        return { titulo, usuarios, usuario, guardarUsuario, errors, editarUsuario, resetForm, eliminar, buscar, listarUsuarios, openModalNuevoUsuario, displayModal }
    }
}
</script>