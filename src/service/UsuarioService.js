import { http } from "./HttpAxios";
import { rutaRol } from "@/utils/rolRuta";

export default {
    listar(q=''){
        return http().get(`${rutaRol()}/usuario?buscado=${q}`);
    },
    guardar(datos){
        return http().post(`${rutaRol()}/usuario`, datos); 
    },
    mostrar(id){
        // return http().get(`${rutaRol()}/usuario/${id}`); //Informal
        return http().get(`${rutaRol()}/usuario/${id}`);
    },
    modificar(id, datos){
        return http().put(`${rutaRol()}/usuario/${id}`, datos);
    },
    eliminar(id){
        return http().delete(`${rutaRol()}/usuario/${id}`);
    }
     
}