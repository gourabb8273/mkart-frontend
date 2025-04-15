import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_PRODUCT_CATELOG_API_BASE_URL;

export const updateProductStock = async ({ productId, stockCount, updatedBy }) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/products/inventory/${productId}`, {
      stockCount,
      updatedBy,
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating stock for product ${productId}:`, error);
    throw error;
  }
};
