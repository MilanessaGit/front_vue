import { http } from "./HttpAxios"
import { rutaRol } from "@/utils/rolRuta";

export default {
    listar(){
        return http().get(`${rutaRol()}/venta`);
    },
    guardar(datos){
        console.log(datos)
        return http().post(`${rutaRol()}/venta`, datos);
    },
    mostrar(id){
        return http().get(`${rutaRol()}/venta/${id}`);
    },
    modificar(id, datos){
        return http().put(`${rutaRol()}/venta/${id}`, datos);
    },
    eliminar(id){
        return http().delete(`${rutaRol()}/venta/${id}`);
    },
    buscar(q=''){
        return http().get(`${rutaRol()}/venta?q=${q}&limit=5`);
    }
}