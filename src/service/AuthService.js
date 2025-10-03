import { http } from "./HttpAxios"

export default {
    login(datos){
        return http().post('/v1/auth/login', datos);
    },
    registro(datos){
        return http().post('/v1/auth/register', datos);
    },
    getPerfil(){
        return http().get('/v1/auth/perfil');
    },
    logout(){
        return http().post('/v1/auth/logout');
    }
}
