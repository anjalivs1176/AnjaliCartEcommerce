// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import api  from "../../config/api";

// interface SellerState {
//   seller: any;
//   loading: boolean;
//   error: string | null;
//   token: string | null;
// }

// const initialState: SellerState = {
//   seller: null,
//   loading: false,
//   error: null,
//   token: localStorage.getItem("token") || null,
// };

// export const fetchSellerProfile = createAsyncThunk(
//   "seller/fetchSellerProfile",
//   async (jwt: string, { rejectWithValue }) => {
//     try {
//       const response = await api.get("/seller/profile", {
//         headers: { Authorization: `Bearer ${jwt}` },
//       });
//       return response.data;
//     } catch (error: any) {
//       return rejectWithValue(error.response?.data || "Failed to fetch seller");
//     }
//   }
// );

// const sellerSlice = createSlice({
//   name: "seller",
//   initialState,
//   reducers: {
//     logoutSeller: (state) => {
//       state.token = null;
//       state.seller = null;
//       localStorage.removeItem("token");
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchSellerProfile.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(fetchSellerProfile.fulfilled, (state, action) => {
//         state.loading = false;
//         state.seller = action.payload;
//       })
//       .addCase(fetchSellerProfile.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       });
//   },
// });

// export const { logoutSeller } = sellerSlice.actions;

// export default sellerSlice.reducer;




import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../config/api";

export const fetchSellerProfile = createAsyncThunk(
  "seller/fetchSellerProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/seller/profile");
      return response.data;
    } catch (error: any) {
      return rejectWithValue("Failed to fetch seller profile");
    }
  }
);

export const fetchSellerOrders = createAsyncThunk(
  "seller/fetchSellerOrders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/seller/orders");
      return response.data;
    } catch (error: any) {
      return rejectWithValue("Failed to fetch seller orders");
    }
  }
);

export const fetchSellerProducts = createAsyncThunk(
  "seller/fetchSellerProducts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/seller/products");
      return response.data;
    } catch (error: any) {
      return rejectWithValue("Failed to fetch seller products");
    }
  }
);

const sellerSlice = createSlice({
  name: "seller",
  initialState: {
    profile: null,
    orders: [],
    products: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSellerProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSellerProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchSellerProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default sellerSlice.reducer;

