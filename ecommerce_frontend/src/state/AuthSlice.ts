import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../config/api";

/* =========================
   SEND OTP (LOGIN / SIGNUP)
   ========================= */
export const sendLoginSignupOtp = createAsyncThunk(
  "auth/sendLoginSignupOtp",
  async (
    { email, flow }: { email: string; flow: "LOGIN" | "SIGNUP" },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post("/auth/send/login-signup-otp", {
        email,
        flow,
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to send OTP"
      );
    }
  }
);

/* =========================
   CUSTOMER LOGIN (OTP)
   ========================= */
export const signin = createAsyncThunk(
  "auth/signin",
  async (loginRequest: any, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/signing", loginRequest);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Login failed"
      );
    }
  }
);

/* =========================
   SELLER LOGIN (PASSWORD)
   ========================= */
export const loginSeller = createAsyncThunk(
  "auth/loginSeller",
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post("/seller/login", {
        email,
        password,
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Invalid Credentials"
      );
    }
  }
);

/* =========================
   LOGOUT
   ========================= */
export const logout = createAsyncThunk(
  "auth/logout",
  async (navigate: any) => {
    localStorage.clear();
    navigate("/");
  }
);

/* =========================
   STATE
   ========================= */
interface AuthState {
  message: string | null;
  loading: boolean;
  error: string | null;
  token: string | null;
  user: {
    name: string;
  } | null;
}

const initialState: AuthState = {
  message: null,
  loading: false,
  error: null,
  token: localStorage.getItem("token"),
  user: localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")!)
    : null,
};

/* =========================
   SLICE
   ========================= */
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder

      /* ---------- SEND OTP ---------- */
      .addCase(sendLoginSignupOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendLoginSignupOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload?.message || "OTP sent";
      })
      .addCase(sendLoginSignupOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      /* ---------- CUSTOMER LOGIN ---------- */
      .addCase(signin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signin.fulfilled, (state, action) => {
        state.loading = false;

        const token = action.payload?.jwt;
        if (token) {
          state.token = token;
          localStorage.setItem("token", token);
          localStorage.setItem("role", action.payload?.role);
        }

        state.user = {
          name: action.payload?.name,
        };
        localStorage.setItem("user", JSON.stringify(state.user));
      })
      .addCase(signin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      /* ---------- SELLER LOGIN ---------- */
      .addCase(loginSeller.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginSeller.fulfilled, (state, action) => {
        state.loading = false;

        const token = action.payload?.jwt;
        if (token) {
          state.token = token;
          localStorage.setItem("token", token);
          localStorage.setItem("role", "ROLE_SELLER");
        }
      })
      .addCase(loginSeller.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearAuthError } = authSlice.actions;
export default authSlice.reducer;
