import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../config/api";

interface Order {
  id: number;
  orderId?: string;
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


export const fetchSellerOrders = createAsyncThunk(
  "seller/fetchOrders",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/api/seller/orders", {
        headers: { Authorization: token },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue("Failed to load orders");
    }
  }
);

export const updateSellerOrderStatus = createAsyncThunk(
  "seller/updateOrderStatus",
  async (
    { orderId, status }: { orderId: number; status: string },
    { rejectWithValue }
  ) => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.patch(
        `/api/seller/orders/${orderId}/status/${status}`,
        {},
        { headers: { Authorization: token } }
      );
      return res.data;
    } catch (err) {
      return rejectWithValue("Failed to update order");
    }
  }
);

const sellerOrderSlice = createSlice({
  name: "sellerOrders",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
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
