import { http } from "./HttpAxios"

export default {
    listar(){
        return http().get("/admin/recomendar");
    },
    guardar(datos){
        return http().post("/admin/recomendar", datos); 
    },
    mostrar(id){
        // return http().get("/admin/usuario/"+id); //Informal
        return http().get(`/admin/recomendar/${id}`);
    },
    modificar(id, datos){
        return http().put(`/admin/recomendar/${id}`, datos);
    },
    eliminar(id){
        return http().delete(`/admin/recomendar/${id}`);
    }
}
