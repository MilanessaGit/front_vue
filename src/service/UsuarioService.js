import { http } from "./HttpAxios";

export default {
    listar(q=''){
        return http().get("/admin/usuario?buscado="+q);
    },
    guardar(datos){
        return http().post("/admin/usuario", datos); 
    },
    mostrar(id){
        // return http().get("/admin/usuario/"+id); //Informal
        return http().get(`/admin/usuario/${id}`);
    },
    modificar(id, datos){
        return http().put(`/admin/usuario/${id}`, datos);
    },
    eliminar(id){
        return http().delete(`/admin/usuario/${id}`);
    }
     
}