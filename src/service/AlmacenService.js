import { http } from "./HttpAxios"

export default {
    listar(){
        return http().get(`/admin/almacen`);
    },
    guardar(datos){
        console.log(datos)
        return http().post("/admin/almacen", datos);
    },
    mostrar(id){
        return http().get(`/admin/almacen/${id}`);
    },
    modificar(id, datos){
        return http().put(`/admin/almacen/${id}`, datos);
    },
    eliminar(id){
        return http().delete(`/admin/almacen/${id}`);
    },
    buscar(q=''){
        return http().get(`/admin/almacen?q=${q}&limit=5`);
    }
}