import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../config/api";

export interface OrderItem {
  id: number;
  product: {
    title: string;
    images: string[];
  };
  quantity: number;
}

export interface Order {
  id: number;
  user: {
    name: string;
  };
  totalSellingPrice: number;
  orderStatus: string;
  deliverDate: string;
  orderItems: OrderItem[];
}

export interface SellerTransactionsState {
  transactions: Order[];
  loading: boolean;
  error: string | null;
}

const initialState: SellerTransactionsState = {
  transactions: [],
  loading: false,
  error: null,
};

export const fetchSellerTransactions = createAsyncThunk<
  Order[], 
  void,    
  { rejectValue: string }
>("seller/fetchTransactions", async (_, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("token");

    const res = await api.get("/api/seller/orders", {
      headers: { Authorization: token },
    });
    return res.data.filter(
      (order: Order) => order.orderStatus === "DELIVERED"
    );
  } catch (err) {
    return rejectWithValue("Failed to load transactions");
  }
});

const sellerTransactionsSlice = createSlice({
  name: "sellerTransactions",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSellerTransactions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSellerTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload;
      })
      .addCase(fetchSellerTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Error";
      });
  },
});

export default sellerTransactionsSlice.reducer;
