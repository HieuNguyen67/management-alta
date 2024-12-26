import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { collection, addDoc, getDoc, doc } from "firebase/firestore";
import { db } from "@/firebaseConfig";

const fetchQuestion = async (questionId: string) => {
  const questionRef = doc(db, "questions", questionId);
  const questionSnap = await getDoc(questionRef);
  if (!questionSnap.exists()) {
    throw new Error(`Question with ID ${questionId} does not exist.`);
  }
  return questionSnap.data();
};

export const submitAnswers = createAsyncThunk(
  "userAnswers/submitAnswers",
  async ({
    userId,
    examId,
    answers,
  }: {
    userId: string;
    examId: string;
    answers: { questionId: string; selectedOption: string }[];
  }) => {
    let score = 0;
    const validatedAnswers: any[] = [];

    for (const answer of answers) {
      const { questionId, selectedOption } = answer;
      const questionData: any = await fetchQuestion(questionId);

      let isCorrect = false;
      if (questionData.type === "multiple-choice") {
        const option = questionData.options.find(
          (opt: any) => opt.id === selectedOption
        );
        if (option && option.isCorrect) {
          isCorrect = true;
          score += questionData.marks;
        }
      } else if (questionData.type === "fill-in-the-blank") {
        if (
          selectedOption.trim().toLowerCase() ===
          questionData.correctAnswer.trim().toLowerCase()
        ) {
          isCorrect = true;
          score += questionData.marks;
        }
      }

      validatedAnswers.push({
        questionId,
        selectedOption,
        isCorrect,
        marks: isCorrect ? questionData.marks : 0,
      });
    }

    const docRef = await addDoc(collection(db, "userAnswers"), {
      userId,
      examId,
      answers: validatedAnswers,
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
