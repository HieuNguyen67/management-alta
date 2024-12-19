import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const updateJob = createAsyncThunk(
  "job/updateJob",
  async (jobData: any, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/api/jobs/${jobData.id}`, jobData);
      return response.data; 
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

interface JobState {
  jobs: any[];
  loading: boolean;
  error: string | null;
}

const initialState: JobState = {
  jobs: [],
  loading: false,
  error: null,
};

const jobSlice = createSlice({
  name: "job",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(updateJob.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateJob.fulfilled, (state, action) => {
        state.loading = false;
        const updatedJob = action.payload;
        state.jobs = state.jobs.map((job) =>
          job.id === updatedJob.id ? updatedJob : job
        );
      })
      .addCase(updateJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default jobSlice.reducer;
