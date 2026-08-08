import { http } from "./HttpAxios";
import { rutaRol } from "@/utils/rolRuta";

export default {
    listar(){
        return http().get(`${rutaRol()}/categoria`);
    },
    guardar(datos){
        return http().post(`${rutaRol()}/categoria`, datos); 
    },
    mostrar(id){
        // return http().get("/admin/usuario/"+id); //Informal
        return http().get(`${rutaRol()}/categoria/${id}`);
    },
    modificar(id, datos){
        return http().put(`${rutaRol()}/categoria/${id}`, datos);
    },
    eliminar(id){
        return http().delete(`${rutaRol()}/categoria/${id}`);
    }
     
}