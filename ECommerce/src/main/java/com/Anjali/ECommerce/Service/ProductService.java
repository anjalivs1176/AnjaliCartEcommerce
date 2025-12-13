package com.Anjali.ECommerce.Service;

import com.Anjali.ECommerce.Model.Product;
import com.Anjali.ECommerce.Model.Seller;
import com.Anjali.ECommerce.Request.CreateProductRequest;
import com.Anjali.ECommerce.exception.ProductException;
import org.springframework.data.domain.Page;

import java.util.List;

public interface ProductService {

    public Product createProduct(CreateProductRequest req, Seller seller);

    public void deleteProduct(Long productId) throws ProductException;

    public Product updateProduct(Long productId, Product product) throws ProductException;

    public Product findProductById(Long productId) throws ProductException;

    List<Product> searchProducts(String query);

    public Page<Product> getAllProducts(
            String category,
            String brand,
            String colors,
            String sizes,
            Integer minPrice,
            Integer maxPrice,
            Integer minDiscount,
            String sort,
            String stock,
            Integer PageNumber
    );

    List<Product> getProductBySellerId(Long sellerId);
}
