import { http } from "./HttpAxios";
import { rutaRol } from "@/utils/rolRuta";

export default {

    listar(entrada_id = null){
        let url = `${rutaRol()}/pago`;
        if(entrada_id){
            url += `?entrada_id=${entrada_id}`;
        }
        return http().get(url);
    },

    guardar(datos) {
        return http().post(`${rutaRol()}/pago`, datos);
    },

    mostrar(id) {
        return http().get(`${rutaRol()}/pago/${id}`);
    },

    eliminar(id) {
        return http().delete(`${rutaRol()}/pago/${id}`);
    }

}