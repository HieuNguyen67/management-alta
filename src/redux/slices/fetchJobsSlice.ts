import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
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

export const fetchJobs = createAsyncThunk("jobs/fetchJobs", async () => {
  const querySnapshot = await getDocs(collection(db, "jobs"));
  const jobs: Job[] = [];
  querySnapshot.forEach((doc) => {
    jobs.push({ id: doc.id, ...doc.data() } as Job);
  });
  return jobs;
});

export const deleteJob = createAsyncThunk(
  "jobs/deleteJob",
  async (id: string, { rejectWithValue }) => {
    try {
      const jobDocRef = doc(db, "jobs", id);
      await deleteDoc(jobDocRef);
      return id; 
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to delete job");
    }
  }
);

export const updateJob = createAsyncThunk(
  "jobs/updateJob",
  async (job: Job, { rejectWithValue }) => {
    try {
      const jobDocRef = doc(db, "jobs", job.id);
      await updateDoc(jobDocRef, {
        jobName: job.jobName,
        companyName: job.companyName,
        companyImage: job.companyImage,
        jobField: job.jobField,
        workLocations: job.workLocations,
        description: job.description,
        jobDescriptionFile: job.jobDescriptionFile,
        status: job.status,
      });
      return job; 
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to update job");
    }
  }
);

const initialState: JobState = {
  jobs: [],
  loading: false,
  error: null,
};

export const updateJobStatus = createAsyncThunk(
  "jobs/updateJobStatus",
  async (
    { id, status }: { id: string; status: string },
    { rejectWithValue }
  ) => {
    try {
      const jobDocRef = doc(db, "jobs", id);
      await updateDoc(jobDocRef, { status }); 
      return { id, status };
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to update job status");
    }
  }
);

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
      .addCase(fetchJobs.fulfilled, (state, action: PayloadAction<Job[]>) => {
        state.loading = false;
        state.jobs = action.payload;
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch jobs";
      })
      .addCase(deleteJob.fulfilled, (state, action: PayloadAction<string>) => {
        state.jobs = state.jobs.filter((job) => job.id !== action.payload);
      })
      .addCase(deleteJob.rejected, (state, action) => {
        state.error = action.payload as string; 
      })
      .addCase(
        updateJobStatus.fulfilled,
        (state, action: PayloadAction<{ id: string; status: string }>) => {
          const jobIndex = state.jobs.findIndex(
            (job) => job.id === action.payload.id
          );
          if (jobIndex !== -1) {
            state.jobs[jobIndex].status = action.payload.status; 
          }
        }
      )
      .addCase(updateJob.fulfilled, (state, action: PayloadAction<Job>) => {
        const jobIndex = state.jobs.findIndex(
          (job) => job.id === action.payload.id
        );
        if (jobIndex !== -1) {
          state.jobs[jobIndex] = action.payload; 
        }
      })
      .addCase(updateJob.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export default jobSlice.reducer;
