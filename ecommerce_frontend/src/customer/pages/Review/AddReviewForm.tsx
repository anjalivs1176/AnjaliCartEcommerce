import React, { useState } from "react";
import { Button, Rating, TextField } from "@mui/material";
import { useAppDispatch } from "../../../state/store";
import { addReview } from "../../../state/reviews/reviewSlice";

const AddReviewForm = ({ productId }: { productId: number }) => {
  const dispatch = useAppDispatch();

  const [rating, setRating] = useState<number | null>(0);
  const [text, setText] = useState("");

  const handleSubmit = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login to write a review");
      return;
    }

    const reviewData = {
      reviewText: text,
      reviewRating: rating ?? 0,
      productImage: [],
    };


    dispatch(addReview({ productId, body: reviewData, token }));
    setText("");
    setRating(0);
  };

  return (
    <div className="space-y-4 mt-6 p-5 border rounded-lg bg-gray-50">
      <h2 className="text-lg font-semibold">Write a Review</h2>

      <Rating
        value={rating}
        onChange={(_, newValue) => setRating(newValue)}
        size="large"
      />

      <TextField
        label="Write your review"
        fullWidth
        multiline
        rows={3}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <Button
        variant="contained"
        fullWidth
        disabled={!rating || !text.trim()}
        onClick={handleSubmit}
      >
        Submit Review
      </Button>
    </div>
  );
};

export default AddReviewForm;
