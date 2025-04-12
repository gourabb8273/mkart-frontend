import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_PRODUCT_CART_API_BASE_URL;

export const getCartItems = async (userId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/carts?userId=${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching cart items:", error);
    throw error;
  }
};

export const addItemToCart = async ({ userId, productId, quantity }) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/carts`, {
      userId,
      productId,
      quantity,
    });
    return response.data;
  } catch (error) {
    console.error("Error adding to cart:", error);
    throw error;
  }
};

export const updateCartItemQuantity = async ({
  userId,
  productId,
  quantity,
}) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/carts`, {
      userId,
      productId,
      quantity,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating cart item quantity:", error);
    throw error;
  }
};

export const removeCartItem = ({ userId, productId }) =>
  axios.delete(`${API_BASE_URL}/carts`, {
    data: { userId, productId },
  });

export const markCartItemsAsOrdered = async (cartIds) => {
  try {
    const response = await axios.patch(`${API_BASE_URL}/carts/markAsOrdered`, {
      cartIds,
    });
    return response.data;
  } catch (error) {
    console.error("Error marking cart items as ordered:", error);
    throw error;
  }
};
