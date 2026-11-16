import { API, getAuthHeader } from "../api";

// data: order number, customer id, total amount, order status(pending, shipped, delivered, cancelled), shipping address, notes

// transaction detail: transaction id, book id, quantity, price, subtotal
export const getMyTransactions = async () => {
  try {
    const { data } = await API.get("/transactions/history", {
      headers: getAuthHeader(),
    });
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const createTransaction = async (data) => {
  try {
    const res = await API.post("/transactions", data, {
      headers: getAuthHeader(),
    });
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getTransactions = async () => {
  try {
    const { data } = await API.get(`/transactions`, {
      headers: getAuthHeader(),
    });
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const updateTransaction = async (id, data) => {
  try {
    const res = await API.patch(`/transactions/${id}`, data, {
      headers: getAuthHeader(),
    });
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const deleteTransaction = async (id) => {
  try {
    await API.delete(`/transactions/${id}`, {
      headers: getAuthHeader(),
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
};
