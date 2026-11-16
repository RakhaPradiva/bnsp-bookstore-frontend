import { API, getAuthHeader } from "../api";

// data: name, email, password, role
export const getUsers = async () => {
	try {
		const { data } = await API.get("/users");
		return data.data;
	} catch (error) {
		console.log(error);
		throw error;
	}
};

export const showUser = async (id) => {
	try {
		const { data } = await API(`/users/${id}`, {
			headers: getAuthHeader(),
		});
		return data.data;
	} catch (error) {
		console.log(error);
		throw error;
	}
};

export const updateUser = async (id, data) => {
	try {
		const res = await API.patch(`/users/${id}`, data, {
			headers: getAuthHeader(),
		});
		return res.data;
	} catch (error) {
		console.log(error);
		throw error;
	}
};

export const deleteUser = async (id) => {
	try {
		await API.delete(`/users/${id}`);
	} catch (error) {
		console.log(error);
		throw error;
	}
};
