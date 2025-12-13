package com.Anjali.ECommerce.Controller;

import com.Anjali.ECommerce.Model.Product;
import com.Anjali.ECommerce.Request.CreateReviewRequest;
import com.Anjali.ECommerce.Service.ProductService;
import com.Anjali.ECommerce.Service.ReviewService;
import com.Anjali.ECommerce.Service.UserService;
import com.Anjali.ECommerce.Model.Review;
import com.Anjali.ECommerce.Model.User;
import com.Anjali.ECommerce.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class ReviewController {

    private final ReviewService reviewService;
    private final UserService userService;
    private final ProductService productService;

    // Get all reviews for a specific product
    @GetMapping("/products/{productId}/reviews")
    public ResponseEntity<List<Review>> getReviewsByProductId(
            @PathVariable Long productId){
        List<Review> reviews = reviewService.getReviewByProductId(productId);
        return ResponseEntity.ok(reviews);
    }

    // Add a review for a product by a logged-in user
    @PostMapping("/products/{productId}/reviews")
    public ResponseEntity<Review> writeReview(
            @RequestBody CreateReviewRequest req,
            @PathVariable Long productId,
            @RequestHeader("Authorization") String jwt) throws Exception{

        // Fetch user from JWT token
        User user = userService.findUserByJwtToken(jwt);

        // Fetch product to associate the review
        Product product = productService.findProductById(productId);

        // Create the review
        Review review = reviewService.createReview(req, user, product);
        return ResponseEntity.ok(review);
    }

    // Update a review by the user who created it
    @PatchMapping("/reviews/{reviewId}")
    public ResponseEntity<Review> updateReview(
            @RequestBody CreateReviewRequest req,
            @RequestHeader("Authorization") String jwt,
            @PathVariable Long reviewId) throws Exception{

        User user = userService.findUserByJwtToken(jwt);

        Review review = reviewService.updateReview(
                reviewId,
                req.getReviewText(),
                req.getReviewRating(),
                user.getId()
        );
        return ResponseEntity.ok(review);
    }

    // Delete a review by the user who created it
    @DeleteMapping("/reviews/{reviewId}")
    public ResponseEntity<ApiResponse> deleteReview(
            @PathVariable Long reviewId,
            @RequestHeader("Authorization") String jwt) throws Exception{

        User user = userService.findUserByJwtToken(jwt);

        reviewService.deleteReview(reviewId, user.getId());

        ApiResponse res = new ApiResponse();
        res.setMessage("Review Deleted Successfully");
        return ResponseEntity.ok(res);
    }
}
