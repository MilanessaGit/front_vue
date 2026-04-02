export const rutaRol = () => {

    const rol = localStorage.getItem("role");

    const rutas = {
        admin: "/admin",
        supervisor: "/supervisor",
        vendedor: "/vendedor"
    }

    return rutas[rol] || "";
}