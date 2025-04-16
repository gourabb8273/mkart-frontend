import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_PRODUCT_CATELOG_API_BASE_URL;

export const fetchProducts = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/search`);
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};
