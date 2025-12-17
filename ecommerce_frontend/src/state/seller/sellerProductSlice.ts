import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../config/api";
import { Product } from "../../type/productType";


export const fetchSellerProducts = createAsyncThunk<Product[]>(
  "sellerProduct/fetchSellerProducts",
  async (_, { rejectWithValue }) => {
    try {
      // interceptor adds Authorization: Bearer <token>
      const response = await api.get("/seller/products");
      return response.data;
    } catch (error) {
      return rejectWithValue("Failed to load products");
    }
  }
);


export const createProduct = createAsyncThunk(
  "sellerProduct/createProduct",
  async ({ request }: { request: any }, { rejectWithValue }) => {
    try {
      const response = await api.post("/seller/products", request);
      return response.data;
    } catch (error) {
      return rejectWithValue("Failed to create product");
    }
  }
);


export const updateProduct = createAsyncThunk(
  "sellerProduct/updateProduct",
  async (
    { productId, request }: { productId: number; request: any },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.put(
        `/seller/products/${productId}`,
        request
      );
      return response.data;
    } catch (error) {
      return rejectWithValue("Failed to update product");
    }
  }
);


export const deleteProduct = createAsyncThunk(
  "sellerProduct/deleteProduct",
  async (productId: number, { rejectWithValue }) => {
    try {
      await api.delete(`/seller/products/${productId}`);
      return productId;
    } catch (error) {
      return rejectWithValue("Failed to delete product");
    }
  }
);


export const toggleStock = createAsyncThunk(
  "sellerProduct/toggleStock",
  async (
    { productId, stockStatus }: { productId: number; stockStatus: boolean },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.put(
        `/seller/products/${productId}/stock`,
        { stockStatus }
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
      // FETCH
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

      // CREATE
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

      // UPDATE
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.products.findIndex(
          (p) => p.id === action.payload.id
        );
        if (index !== -1) {
          state.products[index] = action.payload;
        }
      })

      // DELETE
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter(
          (p) => p.id !== action.payload
        );
      })

      // TOGGLE STOCK
      .addCase(toggleStock.fulfilled, (state, action) => {
        const index = state.products.findIndex(
          (p) => p.id === action.payload.id
        );
        if (index !== -1) {
          state.products[index] = action.payload;
        }
      });
  },
});

export const { resetStatus } = sellerProductSlice.actions;
export default sellerProductSlice.reducer;
