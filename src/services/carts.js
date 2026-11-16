import { API, getAuthHeader } from "../api";

// data: customer id, book id, quantity
export const getCarts = async () => {
	try {
		const { data } = await API.get("/carts", {
			headers: getAuthHeader(),
		});
		return data;
	} catch (error) {
		console.log(error);
		throw error;
	}
};

export const createCart = async (data) => {
	try {
		const res = await API.post("/carts", data, {
			headers: getAuthHeader(),
		});
		return res.data;
	} catch (error) {
		console.log(error);
		throw error;
	}
};

export const getCart = async (id) => {
	try {
		const { data } = await API.get(`/carts/${id}`, {
			headers: getAuthHeader(),
		});
		return data;
	} catch (error) {
		console.log(error);
		throw error;
	}
};

export const updateCart = async (id, data) => {
	try {
		const res = await API.put(`/carts/${id}`, data, {
			headers: getAuthHeader(),
		});
		return res.data;
	} catch (error) {
		console.log(error);
		throw error;
	}
};

export const deleteCart = async (id) => {
	try {
		await API.delete(`/carts/${id}`, {
			headers: getAuthHeader(),
		});
	} catch (error) {
		console.log(error);
		throw error;
	}
};
