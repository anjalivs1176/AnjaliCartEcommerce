import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../config/api";

interface WishlistState {
  items: any[];
  loading: boolean;
  error: string | null;
}

const initialState: WishlistState = {
  items: [],
  loading: false,
  error: null,
};


export const fetchWishlist = createAsyncThunk(
  "wishlist/fetchWishlist",
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem("token");
    if (!token) return [];

    try {
      const res = await api.get("/wishlist");
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);



export const addToWishlist = createAsyncThunk(
  "wishlist/addToWishlist",
  async (productId: number, { dispatch }) => {
    await api.post(`/wishlist/add-product/${productId}`);
    dispatch(fetchWishlist());
  }
);


export const removeFromWishlist = createAsyncThunk(
  "wishlist/removeFromWishlist",
  async (productId: number, { dispatch }) => {
    await api.post(`/wishlist/add-product/${productId}`);
    dispatch(fetchWishlist());
  }
);



const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default wishlistSlice.reducer;
