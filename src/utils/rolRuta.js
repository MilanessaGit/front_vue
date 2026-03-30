export const rutaRol = () => {

    const rol = localStorage.getItem("role");

    const rutas = {
        admin: "/admin",
        supervisor: "/supervisor",
        usuario: "/vendedor"
    }

    return rutas[rol] || "";
}