import { http } from "./HttpAxios"

export default {
    listar(){
        return http().get(`/admin/venta`);
    },
    guardar(datos){
        console.log(datos)
        return http().post("/admin/venta", datos);
    },
    mostrar(id){
        return http().get(`/admin/venta/${id}`);
    },
    modificar(id, datos){
        return http().put(`/admin/venta/${id}`, datos);
    },
    eliminar(id){
        return http().delete(`/admin/venta/${id}`);
    },
    buscar(q=''){
        return http().get(`/admin/venta?q=${q}&limit=5`);
    }
}