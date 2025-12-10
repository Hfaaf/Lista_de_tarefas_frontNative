import axios from "axios"

const BASE_URL = "http://192.168.0.13:3000/"

export const api = axios.create({
    baseURL: BASE_URL,
    timeout: 5000,
})