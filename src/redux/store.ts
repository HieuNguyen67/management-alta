import { configureStore } from "@reduxjs/toolkit";
import fetchJobsReducer from "./slices/fetchJobsSlice";
import authReducer from "./slices/authSlice";
import addJobReducer from "./slices/addJobSlice";

const store = configureStore({
  reducer: {
    addJob: addJobReducer,
    fetchJobs: fetchJobsReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
