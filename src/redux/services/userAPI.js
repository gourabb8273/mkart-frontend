import { showNotification } from "../../components/notification";
import {
  setUserProfile,
  setUser,
  setStatus,
  setError,
} from "../slices/userSlice";
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_USER_SERVICE_API_BASE_URL;

// POST call: Save complete user profile after login
export const saveUserData = (userDetails) => async (dispatch) => {
  dispatch(setStatus("loading"));
  try {
    const { name, ...profileWithoutName } = userDetails.profile;

    userDetails = {
      ...userDetails,
      profile: profileWithoutName,
    };
    const response = await axios.post(`${API_BASE_URL}/save`, userDetails);
    const serverData = response.data?.data || {};
    const updatedUserDetails = {
      ...userDetails,
      profile: {
        ...userDetails.profile,
        ...(serverData._id && { _id: serverData._id }),
        ...(serverData.email && { email: serverData.email }),
        ...(serverData.name && { name: serverData.name }),
        ...(serverData.gender && { gender: serverData.gender }),
        ...(serverData.role && { role: serverData.role }),
        ...(serverData.mobile && { mobile: serverData.mobile }),
      },
    };

    dispatch(setUser(updatedUserDetails));
    dispatch(setStatus("succeeded"));
    showNotification("User profile saved successfully!", "success");
  } catch (error) {
    dispatch(
      setError(error.response?.data?.message || "Failed to save user data")
    );
    dispatch(setStatus("failed"));
  }
};

// PATCH call: Update user profile with partial data
export const updateUserData = (profileData) => async (dispatch) => {
  dispatch(setStatus("loading"));
  try {
    await axios.patch(`${API_BASE_URL}/update`, profileData);    
    dispatch(setUserProfile(profileData));
    dispatch(setStatus("succeeded"));
    showNotification("User profile updated successfully!", "success");
  } catch (error) {
    dispatch(
      setError(error.response?.data?.message || "Failed to update user data")
    );
    dispatch(setStatus("failed"));
  }
};

export const fetchUserData = (id) => async (dispatch) => {
  dispatch(setStatus("loading"));
  try {
    const response = await axios.get(`${API_BASE_URL}`, {
      params: { userId: id },
    });
    const matchedUser = response.data?.data;
    if (matchedUser) {
      dispatch(setUserProfile(matchedUser));
      dispatch(setStatus("succeeded"));
    } else {
      throw new Error("User not found");
    }
  } catch (error) {
    dispatch(
      setError(error.response?.data?.message || "Failed to fetch user data")
    );
    dispatch(setStatus("failed"));
  }
};
