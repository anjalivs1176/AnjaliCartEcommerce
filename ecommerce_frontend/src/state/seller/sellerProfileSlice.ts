import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../config/api";

export const fetchSellerProfile = createAsyncThunk(
  "seller/fetchSellerProfile",
  async (_, { rejectWithValue }) => {
    try {
      // interceptor attaches: Authorization: Bearer <token>
      const response = await api.get("/seller/profile");
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch seller profile"
      );
    }
  }
);


export const updateSellerProfile = createAsyncThunk(
  "seller/updateSellerProfile",
  async (updateData: any, { rejectWithValue }) => {
    try {
      const response = await api.patch(
        "/seller/profile/update",
        updateData
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update seller profile"
      );
    }
  }
);


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

const sellerProfileSlice = createSlice({
  name: "sellerProfile",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // FETCH PROFILE
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

      // UPDATE PROFILE
      .addCase(updateSellerProfile.fulfilled, (state, action) => {
        state.seller = action.payload;
      });
  },
});

export default sellerProfileSlice.reducer;
