import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../config/api";

interface Order {
  id: number;
  orderStatus?: string;
  orderItems?: any[];
  shippingAddress?: any;
}

interface SellerOrderState {
  orders: Order[];
  loading: boolean;
  error: string | null;
}

const initialState: SellerOrderState = {
  orders: [],
  loading: false,
  error: null,
};

// ✅ FETCH SELLER ORDERS
export const fetchSellerOrders = createAsyncThunk(
  "seller/fetchOrders",
  async (_, { rejectWithValue }) => {
    try {
      // ❌ no manual token
      // ✅ interceptor adds Authorization: Bearer <token>
      const res = await api.get("/seller/orders");
      return res.data;
    } catch (err) {
      return rejectWithValue("Failed to load seller orders");
    }
  }
);

// ✅ UPDATE ORDER STATUS
export const updateSellerOrderStatus = createAsyncThunk(
  "seller/updateOrderStatus",
  async (
    { orderId, status }: { orderId: number; status: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.patch(
        `/seller/orders/${orderId}/status/${status}`
      );
      return res.data;
    } catch (err) {
      return rejectWithValue("Failed to update order status");
    }
  }
);

const sellerOrderSlice = createSlice({
  name: "sellerOrders",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // FETCH
      .addCase(fetchSellerOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSellerOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchSellerOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // UPDATE
      .addCase(updateSellerOrderStatus.fulfilled, (state, action) => {
        const updatedOrder = action.payload;
        if (!updatedOrder?.id) return;

        state.orders = state.orders.map((order) =>
          order.id === updatedOrder.id ? updatedOrder : order
        );
      });
  },
});

export default sellerOrderSlice.reducer;
