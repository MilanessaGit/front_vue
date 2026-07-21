import { http } from "./HttpAxios";
import { rutaRol } from "@/utils/rolRuta";

export default {

    obtenerDashboard() {
        return http().get(`${rutaRol()}/dashboard`);
    }

}