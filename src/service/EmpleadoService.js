import { http } from "./HttpAxios";
import { rutaRol } from "@/utils/rolRuta";

export default {
    listar(params = {lazyEvent: "{}"} ){
        console.log(params.lazyEvent);
        
        params = JSON.parse(params.lazyEvent);
        console.log(params);    
        
        let page = params.page ? params.page+1 : 1;
        let limit = params.rows ? params.rows : 5;
        
        return http().get(`${rutaRol()}/empleado?page=${page}&limit=${limit}`);
    },
    guardar(datos){ 
        return http().post(`${rutaRol()}/empleado`, datos); 
    },
    mostrar(id){
        // return http().get("/admin/usuario/"+id); //Informal
        return http().get(`${rutaRol()}/empleado/${id}`);
    },
    modificar(id, datos){
        return http().put(`${rutaRol()}/empleado/${id}`, datos);
    },
    eliminar(id){
        return http().delete(`${rutaRol()}/empleado/${id}`);
    },
    buscar(q=''){
        return http().get(`${rutaRol()}/empleado?q=${q}&limit=5`); //limite de 5 empleados
    }
     
}