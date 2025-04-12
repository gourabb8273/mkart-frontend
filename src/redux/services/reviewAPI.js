import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_PRODUCT_CATELOG_API_BASE_URL;

export const fetchReviews = async (productId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/products/reviews/${productId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching reviews:', error);
    throw error;
  }
};

export const addReview = async (productId, reviewData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/products/reviews/${productId}`, reviewData);
    return response.data;
  } catch (error) {
    console.error('Error adding review:', error);
    throw error;
  }
};

export const updateReview = async (reviewId, reviewData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/products/reviews/${reviewId}`, reviewData);
    return response.data;
  } catch (error) {
    console.error('Error updating review:', error);
    throw error;
  }
};

export const deleteReview = async (reviewId, userId) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/products/reviews/${reviewId}`, {
      data: { userId },
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting review:', error);
    throw error;
  }
};