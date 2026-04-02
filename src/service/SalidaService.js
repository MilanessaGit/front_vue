import { http } from "./HttpAxios"
import { rutaRol } from "@/utils/rolRuta";

export default {
    listar(){
        return http().get(`${rutaRol()}/salida`);
    },
    guardar(datos){
        console.log(datos)
        return http().post(`${rutaRol()}/salida`, datos);
    },
    mostrar(id){
        return http().get(`${rutaRol()}/salida/${id}`);
    },
    modificar(id, datos){
        return http().put(`${rutaRol()}/salida/${id}`, datos);
    },
    eliminar(id){
        return http().delete(`${rutaRol()}/salida/${id}`);
    },
    buscar(q=''){
        return http().get(`${rutaRol()}/salida?q=${q}&limit=5`);
    }
}