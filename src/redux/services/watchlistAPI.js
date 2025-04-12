import { showNotification } from "../../components/Notification";
import axios from "axios";
import {
  setWatchlist,
  addWatchlistItem,
  removeWatchlistItem,
  setWatchlistStatus,
  setWatchlistError,
} from "../slices/userSlice";

const API_BASE_URL = process.env.REACT_APP_USER_SERVICE_API_BASE_URL;

// GET: Fetch the user's watchlist
export const getWatchlistData = (userId) => async (dispatch) => {
  dispatch(setWatchlistStatus("loading"));
  try {
    const response = await axios.get(`${API_BASE_URL}/users/wishlist/${userId}`);
    let watchlistData = response.data?.data || [];
    watchlistData = watchlistData.map(({ userId, ...rest }) => rest);
    dispatch(setWatchlist(watchlistData));
    dispatch(setWatchlistStatus("succeeded"));
  } catch (error) {
    dispatch(
      setWatchlistError(
        error.response?.data?.message || "Failed to fetch watchlist"
      )
    );
    dispatch(setWatchlistStatus("failed"));
  }
};

// POST: Add an item to the watchlist
export const addWatchlistData = (watchlistItem) => async (dispatch) => {
  dispatch(setWatchlistStatus("loading"));
  try {
    const response = await axios.post(`${API_BASE_URL}/users/wishlist/add`, watchlistItem);
    const newItem = response.data?.data;
    dispatch(addWatchlistItem(newItem));
    dispatch(setWatchlistStatus("succeeded"));
    showNotification("Item added to watchlist successfully!", "success");
  } catch (error) {
    dispatch(
      setWatchlistError(
        error.response?.data?.message || "Failed to add item to watchlist"
      )
    );
    dispatch(setWatchlistStatus("failed"));
  }
};

// DELETE: Remove an item from the watchlist
export const removeWatchlistData = (itemDetails) => async (dispatch) => {
  dispatch(setWatchlistStatus("loading"));
  try {
    // Note: Axios DELETE requests that include a request body require using the 'data' option.
    await axios.delete(`${API_BASE_URL}/users/wishlist/remove`, { data: itemDetails });
    dispatch(removeWatchlistItem(itemDetails));
    dispatch(setWatchlistStatus("succeeded"));
    showNotification("Item removed from watchlist successfully!", "success");
  } catch (error) {
    dispatch(
      setWatchlistError(
        error.response?.data?.message || "Failed to remove item from watchlist"
      )
    );
    dispatch(setWatchlistStatus("failed"));
  }
};
