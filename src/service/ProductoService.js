import { http } from "./HttpAxios";
import { rutaRol } from "@/utils/rolRuta";

export default {
    
    listar(params = {lazyEvent: "{}"} ){
        console.log(params.lazyEvent);
        
        params = JSON.parse(params.lazyEvent);
        console.log(params);    
        
        let page = params.page ? params.page+1 : 1;
        let limit = params.rows ? params.rows : 5;
        
        return http().get(`${rutaRol()}/producto?page=${page}&limit=${limit}`);
    },
    guardar(datos){ 
        return http().post(`${rutaRol()}/producto`, datos); 
    },
    mostrar(id){
        // return http().get("/admin/usuario/"+id); //Informal
        return http().get(`${rutaRol()}/producto/${id}`);
    },
    modificar(id, datos){
        return http().put(`${rutaRol()}/producto/${id}`, datos);
    },
    eliminar(id){
        return http().delete(`${rutaRol()}/producto/${id}`);
    },
    guardarImagen(fd, id){
        return http().post(`${rutaRol()}/producto/${id}/imagen`, fd);
    },
    filtrar(q=''){
        return http().get(`${rutaRol()}/producto?q=${q}&limit=5`); //limite de 5 productos
    }
     
}