import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoggedIn: false,
  token: null,
  profile: null,
};

const userSlice = createSlice({
  name: "userSlice",
  initialState,
  reducers: {
    userProfile: (state, action) => {
      state.profile = { ...state.profile, ...action.payload };
    },
    signIn: (state, action) => {
      state.isLoggedIn = true;
      state.token = action.payload;
    },
    signOut: (state) => {
      state.profile = null;
      state.isLoggedIn = false;
      state.token = null;
    },
  },
});

export const { signIn, signOut, userProfile } = userSlice.actions;

export default userSlice.reducer;
