import axios from 'axios';
import { BASE_URL } from '../data/constant';


axios.defaults.withCredentials = true;

const apiClient = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
   
});

export default apiClient;