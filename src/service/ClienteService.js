import { http } from "./HttpAxios";

export default {
    listar(params = {lazyEvent: "{}"} ){
            console.log(params.lazyEvent);
            
            params = JSON.parse(params.lazyEvent);
            console.log(params);    
            
            let page = params.page ? params.page+1 : 1;
            let limit = params.rows ? params.rows : 5;
            
            return http().get(`/admin/cliente?page=${page}&limit=${limit}`);
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
    
    filtrar(q=''){
        return http().get(`/admin/cliente?q=${q}&limit=5`); //limite de 5 clientes
    }
     
}