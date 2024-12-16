import { configureStore } from "@reduxjs/toolkit";
import jobReducer from "./slices/jobSlice";
import authReducer from "./slices/authSlice";

const store = configureStore({
  reducer: {
    jobs: jobReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
