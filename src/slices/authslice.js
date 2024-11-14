import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user : localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null,
  loading: false,
  accessToken: localStorage.getItem("accessToken") ? localStorage.getItem("accessToken"): null,
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    setLoginData(state, action) {
        console.log(action.payload)
        const {user,accessToken} = action.payload;
      state.user = user;
      state.accessToken =accessToken;
    },
    setLoading(state, value) {
      state.loading = value.payload;
    },
  },
});

export const { setLoginData, setLoading } = authSlice.actions;

export default authSlice.reducer;