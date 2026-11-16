import { API } from "../api";

// data: customer_id, subject, message
export const getContactMessage = async () => {
  try {
    const { data } = await API.get("/contacts");
    return data.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const createContactMessage = async (data) => {
  try {
    const res = await API.post("/contacts", data);
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const deleteContactMessage = async (id) => {
  try {
    await API.delete(`/contacts/${id}`);
  } catch (error) {
    console.log(error);
    throw error;
  }
};
