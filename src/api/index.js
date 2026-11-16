import axios from "axios";

const url = "http://localhost:8000";

export const API = axios.create({
	baseURL: `${url}/api`,
});
export const getAuthHeader = () => ({
	Authorization: `Bearer ${localStorage.getItem("access-token") ?? ""}`,
});

API.interceptors.request.use((config) => {
	const token = localStorage.getItem("access-token");
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});
export const IMAGE_STORAGE = `${url}/storage`;
