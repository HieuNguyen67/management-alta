import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { db } from "@/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";

export const addJob = createAsyncThunk(
  "jobs/addJob",
  async (jobData: any, { rejectWithValue }) => {
    try {
      const docRef = await addDoc(collection(db, "jobs"), jobData);
      return { id: docRef.id, ...jobData };
    } catch (error) {
      return rejectWithValue(error);
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
  name: "jobs",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addJob.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addJob.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs.push(action.payload);
      })
      .addCase(addJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default jobSlice.reducer;
