import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebaseConfig";

export const fetchExams = createAsyncThunk("exams/fetchExams", async () => {
  const examsSnapshot = await getDocs(collection(db, "exams"));
  return examsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
});

const examsSlice = createSlice({
  name: "exams",
  initialState: {
    exams: [] as any[],
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchExams.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchExams.fulfilled, (state, action) => {
        state.loading = false;
        state.exams = action.payload;
      })
      .addCase(fetchExams.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default examsSlice.reducer;
