import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../config/api";

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

// FETCH WISHLIST
export const fetchWishlist = createAsyncThunk(
  "wishlist/fetchWishlist",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/api/wishlist");
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

//ADD TO WISHLIST
export const addToWishlist = createAsyncThunk(
  "wishlist/addToWishlist",
  async (productId: number, { dispatch }) => {
    await api.post(`/api/wishlist/${productId}`);
    // 🔥 instant sync
    dispatch(fetchWishlist());
  }
);

//REMOVE FROM WISHLIST
export const removeFromWishlist = createAsyncThunk(
  "wishlist/removeFromWishlist",
  async (productId: number, { dispatch }) => {
    await api.delete(`/api/wishlist/${productId}`);
    // 🔥 instant sync
    dispatch(fetchWishlist());
  }
);

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      // FETCH
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
