
import { showNotification } from "../../components/notification";
import { setUserProfile, setStatus, setError } from '../slices/userSlice'; // Import setUserProfile
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/user/api/save';

export const saveUserData = (userDetails) => async (dispatch) => {
    dispatch(setStatus('loading')); // Set loading state

    try {
        const response = await axios.post(API_BASE_URL, userDetails); // Make API call
        dispatch(setUserProfile(userDetails)); // Use setUserProfile instead of updateUser
        dispatch(setStatus('succeeded')); // Set the status as succeeded
        showNotification("User profile saved successfully!", "success");
    } catch (error) {
        dispatch(setError(error.response?.data?.message || 'Failed to save user data')); // Set error
        dispatch(setStatus('failed')); // Mark status as failed
    }
};
