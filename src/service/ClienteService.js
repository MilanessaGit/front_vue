import { http } from "./HttpAxios";

export default {
    listar(){    
        return http().get(`/admin/cliente`);
    },
    guardar(datos){ 
        return http().post("/admin/cliente", datos); 
    },
    mostrar(id){
        // return http().get("/admin/usuario/"+id); //Informal
        return http().get(`/admin/cliente/${id}`);
    },
    modificar(id, datos){
        return http().put(`/admin/cliente/${id}`, datos);
    },
    eliminar(id){
        return http().delete(`/admin/cliente/${id}`);
    },
    
    buscar(q=''){
        return http().get(`/admin/cliente?q=${q}&limit=5`); //limite de 5 productos
    }
     
}