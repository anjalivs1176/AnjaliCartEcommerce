export interface ReviewResponse {
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

export interface AddReviewBody {
  reviewText: string;
  reviewRating: number;
  productImage: string[];
}
