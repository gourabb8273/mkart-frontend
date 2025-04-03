import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  auth0Id: null,
  isLoggedIn: false,
  error: null,
  status: "idle",
  profile: null,
  watchlist: [],
  watchlistStatus: "idle",
  watchlistError: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      const { auth0Id, isLoggedIn, profile } = action.payload;
      state.profile = profile;
      state.auth0Id = auth0Id;
      state.isLoggedIn = isLoggedIn;
    },
    setUserProfile: (state, action) => {
      state.profile = action.payload;
    },
    logoutUser: (state) => {
      state.profile = null;
      state.auth0Id = null;
      state.isLoggedIn = false;
      state.watchlist = [];
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setStatus: (state, action) => {
      state.status = action.payload;
    },
    setWatchlist: (state, action) => {
      state.watchlist = action.payload;
    },
    addWatchlistItem: (state, action) => {
      state.watchlist.push(action.payload);
    },
    removeWatchlistItem: (state, action) => {
      state.watchlist = state.watchlist.filter(
        (item) => item.productId !== action.payload.productId
      );
    },
    setWatchlistStatus: (state, action) => {
      state.watchlistStatus = action.payload;
    },
    setWatchlistError: (state, action) => {
      state.watchlistError = action.payload;
    },
  },
});

export const {
  setUser,
  setUserProfile,
  logoutUser,
  setError,
  setStatus,
  setWatchlist,
  addWatchlistItem,
  removeWatchlistItem,
  setWatchlistStatus,
  setWatchlistError,
} = userSlice.actions;

export default userSlice.reducer;
