import { API } from './api'

const backendBaseUrl = import.meta.env.VITE_BACKEND_API_URL

export const backendAPI = new API(backendBaseUrl)
