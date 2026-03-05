import { http } from "./HttpAxios"

export default {
    listar(){
        return http().get(`/admin/salida`);
    },
    guardar(datos){
        console.log(datos)
        return http().post("/admin/salida", datos);
    },
    mostrar(id){
        return http().get(`/admin/salida/${id}`);
    },
    modificar(id, datos){
        return http().put(`/admin/salida/${id}`, datos);
    },
    eliminar(id){
        return http().delete(`/admin/salida/${id}`);
    },
    buscar(q=''){
        return http().get(`/admin/salida?q=${q}&limit=5`);
    }
}