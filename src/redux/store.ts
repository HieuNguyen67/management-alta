import { configureStore } from "@reduxjs/toolkit";
import fetchJobsReducer from "./slices/fetchJobsSlice";
import authReducer from "./slices/authSlice";
import addJobReducer from "./slices/addJobSlice";
import examsReducer from "./slices/examsSlice";
import userAnswersReducer from "./slices/userAnswersSlice";
import questionsReducer from "./slices/questionsSlice";

const store = configureStore({
  reducer: {
    addJob: addJobReducer,
    fetchJobs: fetchJobsReducer,
    auth: authReducer,
    exams: examsReducer,
    questions: questionsReducer,
    userAnswers: userAnswersReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
