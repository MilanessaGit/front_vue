import { http } from "./HttpAxios";

export default {
    listar(){
        return http().get("/admin/categoria");
    },
    guardar(datos){
        return http().post("/admin/categoria", datos); 
    },
    mostrar(id){
        // return http().get("/admin/usuario/"+id); //Informal
        return http().get(`/admin/categoria/${id}`);
    },
    modificar(id, datos){
        return http().put(`/admin/categoria/${id}`, datos);
    },
    eliminar(id){
        return http().delete(`/admin/categoria/${id}`);
    }
     
}