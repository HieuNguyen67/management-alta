import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  email: string;
  role: string;
  isAuthenticated: boolean;
}

const initialState: UserState = {
  email: "",
  role: "",
  isAuthenticated: false,
};

const saveToLocalStorage = (state: UserState) => {
  localStorage.setItem("authUser", JSON.stringify(state));
};

const loadFromLocalStorage = (): UserState => {
  const storedUser = localStorage.getItem("authUser");
  if (storedUser) {
    return JSON.parse(storedUser);
  }
  return initialState;
};

const authSlice = createSlice({
  name: "auth",
  initialState: loadFromLocalStorage(), 
  reducers: {
    loginSuccess(
      state,
      action: PayloadAction<{ email: string; role: string }>
    ) {
      state.email = action.payload.email;
      state.role = action.payload.role;
      state.isAuthenticated = true;

      saveToLocalStorage(state);
    },
    logout(state) {
      state.email = "";
      state.role = "";
      state.isAuthenticated = false;

      localStorage.removeItem("authUser");
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
