import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  id: string;
  email: string;
  role: string;
  name: string;
  isAuthenticated: boolean;
}

const initialState: UserState = {
  id: "",
  email: "",
  role: "",
  name: "",
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
      action: PayloadAction<{
        id: string;
        email: string;
        role: string;
        name: string;
      }>
    ) {
      state.id = action.payload.id;
      state.email = action.payload.email;
      state.role = action.payload.role;
      state.name = action.payload.name;
      state.isAuthenticated = true;

      saveToLocalStorage(state);
    },
    logout(state) {
      state.id = "";
      state.email = "";
      state.role = "";
      state.name = "";
      state.isAuthenticated = false;

      localStorage.removeItem("authUser");
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
