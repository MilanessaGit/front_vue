import { http } from "./HttpAxios"
import { rutaRol } from "@/utils/rolRuta";

export default {
    listar(){
        return http().get(`${rutaRol()}/entrada`);
    },
    guardar(datos){
        console.log(datos)
        return http().post(`${rutaRol()}/entrada`, datos);
    },
    mostrar(id){
        return http().get(`${rutaRol()}/entrada/${id}`);
    },
    modificar(id, datos){
        return http().put(`${rutaRol()}/entrada/${id}`, datos);
    },
    eliminar(id){
        return http().delete(`${rutaRol()}/entrada/${id}`);
    },
    buscar(q=''){
        return http().get(`${rutaRol()}/entrada?q=${q}&limit=5`);
    }
}