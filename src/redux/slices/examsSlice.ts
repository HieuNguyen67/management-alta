import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebaseConfig";

export const fetchExams = createAsyncThunk("exams/fetchExams", async () => {
  const examsSnapshot = await getDocs(collection(db, "exams"));
  return examsSnapshot.docs.map((doc) => {
    const data = doc.data();
    const questions = data.questions.map((question: any) => ({
      ...question,
      type: question.type || "multiple-choice", 
      options: question.options || [], 
      correctAnswer: question.correctAnswer || "", 
    }));
    return { id: doc.id, ...data, questions };
  });
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
