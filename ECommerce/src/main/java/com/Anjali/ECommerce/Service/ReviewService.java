package com.Anjali.ECommerce.Service;

import com.Anjali.ECommerce.Model.Product;
import com.Anjali.ECommerce.Model.Review;
import com.Anjali.ECommerce.Model.User;
import com.Anjali.ECommerce.Request.CreateReviewRequest;

import java.util.List;

public interface ReviewService {

    Review createReview(CreateReviewRequest req,
                        User user,
                        Product product);
    List<Review> getReviewByProductId(Long productId);

    Review updateReview(Long reviewId,String reviewText, double rating,Long userId) throws Exception;

    void deleteReview(Long reviewId,Long userId) throws Exception;

    Review getReviewById(Long reviewId) throws Exception;

}
