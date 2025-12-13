import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../config/api";
import { Product } from "../../type/productType";

export const fetchSellerProducts = createAsyncThunk<Product[]>(
  "sellerProduct/fetchSellerProducts",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
const response = await api.get("/api/sellers/products", {
  headers: {
    Authorization: `Bearer ${token}`
  }
});

      return response.data;
    } catch (error) {
      return rejectWithValue("Failed to load products");
    }
  }
);

export const createProduct = createAsyncThunk(
  "sellerProduct/createProduct",
  async ({ request }: any, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
const response = await api.post("/api/sellers/products", request, {
  headers: {
    Authorization: `Bearer ${token}`
  }
});

      return response.data;
    } catch (error) {
      return rejectWithValue("Failed to create product");
    }
  }
);

export const updateProduct = createAsyncThunk(
  "sellerProduct/updateProduct",
  async ({ productId, request }: any, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
const response = await api.put(`/api/sellers/products/${productId}`, request, {
  headers: {
    Authorization: `Bearer ${token}`
  }
});

      return response.data;
    } catch (err) {
      return rejectWithValue("Failed to update product");
    }
  }
);
export const deleteProduct = createAsyncThunk(
  "sellerProduct/deleteProduct",
  async (productId: number, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
await api.delete(`/api/sellers/products/${productId}`, {
  headers: {
    Authorization: `Bearer ${token}`
  }
});

      return productId;
    } catch (error) {
      return rejectWithValue("Failed to delete product");
    }
  }
);

export const toggleStock = createAsyncThunk(
  "sellerProduct/toggleStock",
  async ({ productId, stockStatus }: any, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
const response = await api.put(
  `/api/sellers/products/${productId}/stock`,
  { stockStatus },
  {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
);

      return response.data;
    } catch (error) {
      return rejectWithValue("Failed to toggle stock");
    }
  }
);

interface SellerProductState {
  products: Product[];
  loading: boolean;
  success: boolean;
  error: string | null;
}

const initialState: SellerProductState = {
  products: [],
  loading: false,
  success: false,
  error: null,
};

const sellerProductSlice = createSlice({
  name: "sellerProduct",
  initialState,
  reducers: {
    resetStatus(state) {
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSellerProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSellerProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchSellerProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.products.push(action.payload);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload as string;
      })

      .addCase(updateProduct.fulfilled, (state, action) => {
        const idx = state.products.findIndex((p) => p.id === action.payload.id);
        if (idx !== -1) state.products[idx] = action.payload;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter((p) => p.id !== action.payload);
      })
      .addCase(toggleStock.fulfilled, (state, action) => {
        const product = action.payload;
        const index = state.products.findIndex((p) => p.id === product.id);
        if (index !== -1) state.products[index] = product;
      });
  },
});

export const { resetStatus } = sellerProductSlice.actions;

export default sellerProductSlice.reducer;

