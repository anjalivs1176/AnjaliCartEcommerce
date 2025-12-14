import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../config/api";

export const fetchSellerProfile = createAsyncThunk(
  "seller/fetchSellerProfile",
  async (jwt: string, { rejectWithValue }) => {
    try {
      const response = await api.get("/seller/profile", {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      console.log("fetch seller profile : ", response.data)
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch profile");
    }
  }
);



export const updateSellerProfile = createAsyncThunk(
  "seller/updateSellerProfile",
  async (updateData: any, { rejectWithValue }) => {
    try {
      const jwt = localStorage.getItem("token");

      const response = await api.patch("/api/seller/profile/update", updateData, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to update profile");
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
  name: "seller",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSellerProfile.pending, (state) => {
        state.loading = true;
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

export default sellerProfileSlice.reducer;
