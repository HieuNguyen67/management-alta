import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { db } from "../../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { query, where } from "firebase/firestore";

export interface Jobs {
  jobId: string;
  jobName: string;
  companyName: string;
  companyImage: string;
  jobField: string;
  workLocations: string[];
  description: string;
  jobDescriptionFile: string;
  status: string;
}

interface JobState {
  jobs: Jobs[];
  loading: boolean;
  error: string | null;
}

const initialState: JobState = {
  jobs: [],
  loading: false,
  error: null,
};

export const fetchJobs = createAsyncThunk("jobs/fetchJobs", async () => {
  const q = query(collection(db, "jobs"), where("status", "==", "active"));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({
    jobId: doc.id,
    ...doc.data(),
  })) as Jobs[];
});

const jobSlice = createSlice({
  name: "jobs",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = action.payload;
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Something went wrong";
      });
  },
});

export default jobSlice.reducer;
