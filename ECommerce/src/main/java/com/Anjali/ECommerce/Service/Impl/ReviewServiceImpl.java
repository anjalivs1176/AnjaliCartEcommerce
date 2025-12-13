package com.Anjali.ECommerce.Service.Impl;

import com.Anjali.ECommerce.Model.Product;
import com.Anjali.ECommerce.Model.Review;
import com.Anjali.ECommerce.Model.User;
import com.Anjali.ECommerce.Repository.ReviewRepository;
import com.Anjali.ECommerce.Request.CreateReviewRequest;
import com.Anjali.ECommerce.Service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;

    /**
     * Create a new review for a product by a user.
     */
    @Override
    public Review createReview(CreateReviewRequest req, User user, Product product) {
        Review review = new Review();
        review.setUser(user);
        review.setProduct(product);
        review.setReviewText(req.getReviewText());
        review.setRating(req.getReviewRating());
        review.setProductImages(req.getProductImage());

        // Add review to product's review list
        product.getReviews().add(review);

        return reviewRepository.save(review);
    }

    /**
     * Get all reviews for a specific product.
     */
    @Override
    public List<Review> getReviewByProductId(Long productId) {
        return reviewRepository.findByProductId(productId);
    }

    /**
     * Update a review. Only the user who created the review can update it.
     */
    @Override
    public Review updateReview(Long reviewId, String reviewText, double rating, Long userId) throws Exception {
        Review review = getReviewById(reviewId);
        if(review.getUser().getId().equals(userId)){
            review.setReviewText(reviewText);
            review.setRating(rating);
            return reviewRepository.save(review);
        }
        throw new Exception("You can't update this Review");
    }

    /**
     * Delete a review. Only the user who created the review can delete it.
     */
    @Override
    public void deleteReview(Long reviewId, Long userId) throws Exception {
        Review review = getReviewById(reviewId);
        if(review.getUser().getId().equals(userId)){
            reviewRepository.delete(review);
        } else {
            throw new Exception("You can't delete this review");
        }
    }

    /**
     * Find a review by ID.
     */
    @Override
    public Review getReviewById(Long reviewId) throws Exception {
        return reviewRepository.findById(reviewId).orElseThrow(() ->
                new Exception("Review not found"));
    }
}
