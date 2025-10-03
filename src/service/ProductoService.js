import { http } from "./HttpAxios";

export default {
    listar(params = ''){
        console.log(params);
        return http().get(`/admin/producto?page=1`);
    },
    guardar(datos){
        return http().post("/admin/producto", datos); 
    },
    mostrar(id){
        // return http().get("/admin/usuario/"+id); //Informal
        return http().get(`/admin/producto/${id}`);
    },
    modificar(id, datos){
        return http().put(`/admin/producto/${id}`, datos);
    },
    eliminar(id){
        return http().delete(`/admin/producto/${id}`);
    },
    guardarImagen(fd, id){
        return http().post(`/admin/producto/${id}/imagen`, fd);
    }
     
}