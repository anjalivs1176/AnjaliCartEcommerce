import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../config/api";

interface CartState {
  cart: any | null;
  loading: boolean;
  error: string | null;
}

const initialState: CartState = {
  cart: null,
  loading: false,
  error: null,
};

// FETCH CART
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem("token");
    if (!token) return null; // ✅ STOP if not logged in

    try {
      const res = await api.get("/cart");
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);


export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async (
    { productId, quantity = 1 }: { productId: number; quantity?: number },
    { dispatch }
  ) => {
    await api.post("/cart/add", { productId, quantity });
    dispatch(fetchCart());
  }
);


// REMOVE FROM CART
export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async (cartItemId: number, { dispatch }) => {
    await api.delete(`/cart/item/${cartItemId}`);
    dispatch(fetchCart());
  }
);

// UPDATE QUANTITY
export const updateCartQuantity = createAsyncThunk(
  "cart/updateQuantity",
  async (
    { cartItemId, quantity }: { cartItemId: number; quantity: number },
    { dispatch }
  ) => {
    await api.put(`/cart/item/${cartItemId}`, { quantity });
    dispatch(fetchCart());
  }
);


const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      // FETCH
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
  state.loading = false;
  if (action.payload) {
    state.cart = action.payload;
  }
})

      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default cartSlice.reducer;
