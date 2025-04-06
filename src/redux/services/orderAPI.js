import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_PRODUCT_ORDER_API_BASE_URL;

export const getOrders = async (userId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/orders?userId=${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
};

export const addOrder = async (orderData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/orders`, orderData);
    return response.data;
  } catch (error) {
    console.error("Error adding order:", error);
    throw error;
  }
};
