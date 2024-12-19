import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { doc, getDocs, collection, updateDoc } from "firebase/firestore";
import { db } from "@/firebaseConfig";

export interface Job {
  id: string;
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
  jobs: Job[];
  loading: boolean;
  error: string | null;
}

export const toggleJobStatus = createAsyncThunk(
  "jobs/toggleJobStatus",
  async ({ id, currentStatus }: { id: string; currentStatus: string }) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    await updateDoc(doc(db, "jobs", id), { status: newStatus });
    return { id, newStatus };
  }
);


const initialState: JobState = {
  jobs: [],
  loading: false,
  error: null,
};

const jobSlice = createSlice({
  name: "jobs",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(toggleJobStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleJobStatus.fulfilled, (state, action) => {
      const { id, newStatus } = action.payload;
      const job = state.jobs.find((job) => job.id === id);
      if (job) job.status = newStatus;
    })
      .addCase(toggleJobStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default jobSlice.reducer;
