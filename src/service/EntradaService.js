import { http } from "./HttpAxios"

export default {
    listar(){
        return http().get(`/admin/entrada`);
    },
    guardar(datos){
        console.log(datos)
        return http().post("/admin/entrada", datos);
    },
    mostrar(id){
        return http().get(`/admin/entrada/${id}`);
    },
    modificar(id, datos){
        return http().put(`/admin/entrada/${id}`, datos);
    },
    eliminar(id){
        return http().delete(`/admin/entrada/${id}`);
    },
    buscar(q=''){
        return http().get(`/admin/entrada?q=${q}&limit=5`);
    }
}