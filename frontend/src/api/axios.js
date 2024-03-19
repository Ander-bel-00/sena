import axios from "axios";
import Cookies from 'js-cookie';
const {REACT_APP_BACKEND_URL} = process.env

const clienteAxios = axios.create({
    baseURL: REACT_APP_BACKEND_URL || 'http://192.168.1.22:5000',
    withCredentials: true,
});

console.log(process.env.REACT_APP_BACKEND_URL);


// Configurar interceptor para incluir el token en las solicitudes
clienteAxios.interceptors.request.use(config => {
    const token = Cookies.get('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

export default clienteAxios;
