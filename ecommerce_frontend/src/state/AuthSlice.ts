import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../config/api";
export const sendLoginSignupOtp = createAsyncThunk(
  "auth/sendLoginSignupOtp",
  async ({ email }: { email: string }, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/send/login-signup-otp", {
        email,
        role: "ROLE_SELLER",
        otp: null,
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to send OTP");
    }
  }
);

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




export const signin = createAsyncThunk<any,any>("/auth/signin",
  async(loginRequest,{rejectWithValue})=>{
    try{
      const response = await api.post("/auth/signin",loginRequest)
      console.log("Login otp", response.data)
    } catch(error){
      console.log("error "+error);
    }
  }
)


export const logout = createAsyncThunk<any,any>("/auth/logout",
  async(navigate, {rejectWithValue})=>{
    try{
      localStorage.clear()
      console.log("logout success")
      navigate("/")
    }catch(error){
      console.log("Error "+ error);
    }
  }
)

interface AuthState {
  message: string | null;
  loading: boolean;
  error: string | null;
  token: string | null;
  user: {
    id: number;
    name: string;
    profileImage: string;
  } | null;
}


const initialState: AuthState = {
  message: null,
  loading: false,
  error: null,
  token: localStorage.getItem("token") || null,

  // 🚀 ADD THIS
  user: localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")!)
    : null,
};


const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearSellerError(state) {
      state.error = null;
    },
    logoutSeller(state) {
      state.token = null;
      localStorage.removeItem("token");          
      localStorage.removeItem("role");
    },
  },
  extraReducers: (builder) => {
    builder
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

      .addCase(loginSeller.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginSeller.fulfilled, (state, action) => {
        state.loading = false;
        state.message = "Login successful";
        state.error = null;

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

export const { clearSellerError, logoutSeller } = authSlice.actions;

export default authSlice.reducer;

