import { http } from "./HttpAxios"
import { rutaRol } from "@/utils/rolRuta";

export default {
    listar(){
        return http().get(`${rutaRol()}/almacen`);
    },
    guardar(datos){
        console.log(datos)
        return http().post(`${rutaRol()}/almacen`, datos);
    },
    mostrar(id){
        return http().get(`${rutaRol()}/almacen/${id}`);
    },
    modificar(id, datos){
        return http().put(`${rutaRol()}/almacen/${id}`, datos);
    },
    eliminar(id){
        return http().delete(`${rutaRol()}/almacen/${id}`);
    },
    buscar(q=''){
        return http().get(`${rutaRol()}/almacen?q=${q}&limit=5`);
    }
}