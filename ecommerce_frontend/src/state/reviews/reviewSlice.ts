
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { AddReviewBody } from "../../type/review";
import { ReviewResponse } from "../../type/review";

import { api } from "../../config/api"


export interface Review {
  id: number;
  reviewText: string;
  rating: number;
  productImages: string[];
  createdAt: string;
  user: {
    id: number;
    name: string;
  };
}

interface ReviewState {
  reviews: ReviewResponse[];
  loading: boolean;
  error: string | null;
}

const initialState: ReviewState = {
  reviews: [],
  loading: false,
  error: null,
};

export const fetchReviews = createAsyncThunk<
  Review[],
  number,
  { rejectValue: string }
>(
  "reviews/fetchReviews",
  async (productId, { rejectWithValue }) => {
    try {
      const res = await api.get(`/api/products/${productId}/reviews`);
      return res.data as Review[];
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message || "Failed to load reviews"
      );
    }
  }
);


export const addReview = createAsyncThunk<
  Review,
  { productId: number; body: AddReviewBody; token: string },
  { rejectValue: string }
>(
  "reviews/addReview",
  async ({ productId, body, token }, { rejectWithValue }) => {
    try {
      const res = await api.post(
        `/api/products/${productId}/reviews`,
        body,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return res.data as Review;
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message || "Failed to add review"
      );
    }
  }
);

export const deleteReview = createAsyncThunk<
  number,
  { reviewId: number; token: string },
  { rejectValue: string }
>(
  "reviews/deleteReview",
  async ({ reviewId, token }, { rejectWithValue }) => {
    try {
      await api.delete(`/api/reviews/${reviewId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return reviewId;
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message || "Failed to delete review"
      );
    }
  }
);



const reviewSlice = createSlice({
  name: "reviews",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchReviews.fulfilled,
        (state, action: PayloadAction<Review[]>) => {
          state.loading = false;
          state.reviews = action.payload;
        }
      )
      .addCase(
        fetchReviews.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.error = action.payload as string;
        }
      )
      .addCase(
        addReview.fulfilled,
        (state, action: PayloadAction<Review>) => {
          state.reviews.unshift(action.payload);
        }
      )
      .addCase(
        deleteReview.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.reviews = state.reviews.filter(
            (rev) => rev.id !== action.payload
          );
        }
      );
  },
});

export default reviewSlice.reducer;
