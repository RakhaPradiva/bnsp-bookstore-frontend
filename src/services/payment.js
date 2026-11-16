import { API, getAuthHeader } from "../api";

// data transaction id. payment method(credit_card, bank_transfer, e-wallet, cod), payment status(pending, paid, failed,refunded), payment proof,
export const getPayments = async () => {
  try {
    const { data } = await API.get("/payments", {
      headers: getAuthHeader(),
    });
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const createPayment = async (data) => {
  try {
    const formData = new FormData();
    formData.append("transaction_id", data.transaction_id);
    formData.append("payment_method", data.payment_method);
    if (data.payment_proof) {
      formData.append("payment_proof", data.payment_proof);
    }

    const res = await API.post("/payments", formData, {
      headers: {
        ...getAuthHeader(),
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const showPayment = async (id) => {
  try {
    const { data } = await API.get(`/payments/${id}`, {
      headers: getAuthHeader(),
    });
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const updatePayment = async (id, data) => {
  try {
    const formData = new FormData();
    formData.append("payment_status", data.payment_status);
    if (data.payment_proof) {
      formData.append("payment_proof", data.payment_proof);
    }

    const res = await API.put(`/payments/${id}`, formData, {
      headers: {
        ...getAuthHeader(),
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const deletePayment = async (id) => {
  try {
    await API.delete(`/payments/${id}`, {
      headers: getAuthHeader(),
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
};
