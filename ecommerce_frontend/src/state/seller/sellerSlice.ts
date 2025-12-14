import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../config/api";

interface SellerState {
  seller: any;
  loading: boolean;
  error: string | null;
}

const initialState: SellerState = {
  seller: null,
  loading: false,
  error: null,
};

// ✅ FETCH SELLER PROFILE (NO TOKEN ARG)
export const fetchSellerProfile = createAsyncThunk(
  "seller/fetchSellerProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/seller/profile");
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch seller profile"
      );
    }
  }
);

// ✅ UPDATE SELLER PROFILE (NO /api/api BUG)
export const updateSellerProfile = createAsyncThunk(
  "seller/updateSellerProfile",
  async (updateData: any, { rejectWithValue }) => {
    try {
      const response = await api.patch("/seller/profile/update", updateData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update profile"
      );
    }
  }
);

const sellerSlice = createSlice({
  name: "seller",
  initialState,
  reducers: {
    logoutSeller(state) {
      state.seller = null;
      localStorage.removeItem("token");
      localStorage.removeItem("role");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSellerProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSellerProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.seller = action.payload;
      })
      .addCase(fetchSellerProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateSellerProfile.fulfilled, (state, action) => {
        state.seller = action.payload;
      });
  },
});

export const { logoutSeller } = sellerSlice.actions;
export default sellerSlice.reducer;
