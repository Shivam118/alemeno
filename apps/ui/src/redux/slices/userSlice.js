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
      state.token = action.payload;
      state.isLoggedIn = true;
    },
    signOut: (state) => {
      state.profile = null;
      state.isLoggedIn = false;
      state.token = null;
    },
    courseEnrollment: (state, action) => {
      state.profile = {
        ...state.profile,
        coursesEnrolled: [...state.profile.coursesEnrolled, action.payload],
      };
    },
    markAsCompleted: (state, action) => {
      state.profile = {
        ...state.profile,
        coursesEnrolled: state.profile.coursesEnrolled.map((course) =>
          course.courseId === action.payload
            ? { ...course, progress: 100 }
            : course
        ),
      };
    },
  },
});

export const {
  signIn,
  signOut,
  userProfile,
  courseEnrollment,
  markAsCompleted,
} = userSlice.actions;

export default userSlice.reducer;
