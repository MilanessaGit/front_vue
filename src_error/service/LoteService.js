import { http } from "./HttpAxios";
import { rutaRol } from "@/utils/rolRuta";

export default {
    listar(params = {lazyEvent: "{}"} ){
        console.log(params.lazyEvent);
        
        params = JSON.parse(params.lazyEvent);
        console.log(params);    
        
        let page = params.page ? params.page+1 : 1;
        let limit = params.rows ? params.rows : 5;
        
        return http().get(`${rutaRol()}/lote?page=${page}&limit=${limit}`);
    },
    guardar(datos){ 
        return http().post(`${rutaRol()}/lote`, datos); 
    },
    mostrar(id){
        // return http().get("/admin/usuario/"+id); //Informal
        return http().get(`${rutaRol()}/lote/${id}`);
    },
    modificar(id, datos){
        return http().put(`${rutaRol()}/lote/${id}`, datos);
    },
    eliminar(id){
        return http().delete(`${rutaRol()}/lote/${id}`);
    },
    
    filtrar(q=''){
        return http().get(`${rutaRol()}/lote?q=${q}&limit=5`); //limite de 5 productos
    }
     
}