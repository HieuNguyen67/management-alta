import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { collection, addDoc, doc, getDoc } from "firebase/firestore";
import { db } from "@/firebaseConfig";

export const submitAnswers = createAsyncThunk(
  "userAnswers/submitAnswers",
  async ({
    userId,
    examId,
    answers,
  }: {
    userId: string;
    examId: string;
    answers: any[];
  }) => {
    let score = 0;
    answers.forEach((answer) => {
      if (answer.isCorrect) score += answer.marks;
    });

    const docRef = await addDoc(collection(db, "userAnswers"), {
      userId,
      examId,
      answers,
      score,
      submittedAt: new Date().toISOString(),
    });

    return { userAnswerId: docRef.id, score };
  }
);

const userAnswersSlice = createSlice({
  name: "userAnswers",
  initialState: {
    answers: [] as any[],
    score: 0,
    loading: false,
    userAnswerId: "",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(submitAnswers.pending, (state) => {
        state.loading = true;
      })
      .addCase(submitAnswers.fulfilled, (state, action) => {
        state.loading = false;
        state.score = action.payload.score;
        state.userAnswerId = action.payload.userAnswerId; 
      })
      .addCase(submitAnswers.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default userAnswersSlice.reducer;
