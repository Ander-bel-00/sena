//Enviar solicitudes al servidor.
import axios from "axios";

//Configuración del servidor, en caso de subir a un dominio.
//solo es cambiar la direccion del host.

const clienteAxios = axios.create({
    baseURL: 'http://localhost:5000',
    withCredentials: true,
});



export default clienteAxios;