// src/slices/userSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null, // Holds user profile information
  auth0Id: null, // Stores the auth0Id
  isLoggedIn: false, // Indicates whether user is logged in or not
  error: null,
  status: 'idle', // Idle or Loading state for managing async requests
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserProfile: (state, action) => {
      const { auth0Id, isLoggedIn, profile } = action.payload;
      state.profile = profile; // Save user profile information
      state.auth0Id = auth0Id; // Save the auth0Id
      state.isLoggedIn = isLoggedIn; // Set the login flag
    },
    logoutUser: (state) => {
      state.profile = null;
      state.auth0Id = null;
      state.isLoggedIn = false;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setStatus: (state, action) => {
      state.status = action.payload;
    },
  },
});

export const { setUserProfile, logoutUser, setError, setStatus } = userSlice.actions;

export default userSlice.reducer;
