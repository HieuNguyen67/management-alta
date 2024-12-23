import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/firebaseConfig";

export const fetchQuestionsByExamId = createAsyncThunk(
  "questions/fetchQuestionsByExamId",
  async (examId: string) => {
    const questionsRef = collection(db, "questions");
    const q = query(questionsRef, where("examId", "==", examId));
    const questionsSnapshot = await getDocs(q);
    return questionsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }
);

const questionsSlice = createSlice({
  name: "questions",
  initialState: {
    questions: [] as any[],
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuestionsByExamId.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchQuestionsByExamId.fulfilled, (state, action) => {
        state.loading = false;
        state.questions = action.payload;
      })
      .addCase(fetchQuestionsByExamId.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default questionsSlice.reducer;
