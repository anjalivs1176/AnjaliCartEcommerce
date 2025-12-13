package com.Anjali.ECommerce.Service.Impl;

import com.Anjali.ECommerce.Model.Category;
import com.Anjali.ECommerce.Model.Product;
import com.Anjali.ECommerce.Model.Seller;
import com.Anjali.ECommerce.Repository.CategoryRepository;
import com.Anjali.ECommerce.Repository.ProductRepository;
import com.Anjali.ECommerce.Request.CreateProductRequest;
import com.Anjali.ECommerce.Request.UpdateProductRequest;
import com.Anjali.ECommerce.Service.ProductService;
import com.Anjali.ECommerce.exception.ProductException;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    @Override
    public Product createProduct(CreateProductRequest req, Seller seller) {

        //Validate categories 
        Category category1 = categoryRepository.findByCategoryId(req.getCategory());
        Category category2 = categoryRepository.findByCategoryId(req.getCategory2());
        Category category3 = categoryRepository.findByCategoryId(req.getCategory3());

        if (category1 == null) {
            throw new RuntimeException("Invalid Level 1 category: " + req.getCategory());
        }
        if (category2 == null) {
            throw new RuntimeException("Invalid Level 2 category: " + req.getCategory2());
        }
        if (category3 == null) {
            throw new RuntimeException("Invalid Level 3 category: " + req.getCategory3());
        }

        // Validate category relationships
        // Level 2 must belong to Level 1
        if (category2.getParentCategory() == null
                || !category2.getParentCategory().getId().equals(category1.getId())) {
            throw new RuntimeException("Invalid category hierarchy between Level 1 and Level 2.");
        }

        // Level 3 must belong to Level 2
        if (category3.getParentCategory() == null
                || !category3.getParentCategory().getId().equals(category2.getId())) {
            throw new RuntimeException("Invalid category hierarchy between Level 2 and Level 3.");
        }

        // Calculate discount
        int discountPercentage
                = calculateDiscountpercentage(req.getMrpPrice(), req.getSellingPrice());

        //Create product
        Product product = new Product();
        product.setSeller(seller);
        product.setCategory(category3);  // level 3 final category
        product.setDescription(req.getDescription());
        product.setCreatedAt(LocalDateTime.now());
        product.setTitle(req.getTitle());
        product.setColor(req.getColor());
        product.setSellingPrice(req.getSellingPrice());
        product.setMrpPrice(req.getMrpPrice());
        product.setImages(req.getImages());
        product.setSizes(req.getSize());
        product.setDiscountPercent(discountPercentage);

        return productRepository.save(product);
    }

    private int calculateDiscountpercentage(int mrpPrice, int sellingPrice) {
        if (mrpPrice <= 0) {
            throw new IllegalArgumentException("Actual Price must be greater than Zero...");
        }
        double discount = mrpPrice - sellingPrice;
        double discountPercentage = (discount / mrpPrice) * 100;
        return (int) discountPercentage;
    }

    public Product updateProduct(Long id, UpdateProductRequest req) throws Exception {
        Product product = findProductById(id);

        product.setTitle(req.getTitle());
        product.setDescription(req.getDescription());
        product.setMrpPrice(req.getMrpPrice());
        product.setSellingPrice(req.getSellingPrice());
        product.setColor(req.getColor());
        product.setImages(req.getImages());
        product.setSizes(req.getSize());

        // Convert category IDs to real Category objects
        Category c3 = categoryRepository.findByCategoryId(req.getCategory3());
        product.setCategory(c3);

        return productRepository.save(product);
    }

    @Override
    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }

    @Override
    public Product updateProduct(Long productId, Product product) throws ProductException {
        findProductById(productId);
        product.setId(productId);
        return productRepository.save(product);
    }

    @Override
    public Product findProductById(Long productId) throws ProductException {
        return productRepository.findById(productId).orElseThrow(()
                -> new ProductException("Product not found with Id: " + productId));
    }

    @Override
    public List<Product> searchProducts(String query) {
        return productRepository.searchProduct(query);
    }

    @Override
    public Page<Product> getAllProducts(
            String category,
            String brand,
            String color,
            String size,
            Integer minPrice,
            Integer maxPrice,
            Integer minDiscount,
            String sort,
            String stock,
            Integer pageNumber) {

        Specification<Product> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (category != null) {
                Join<Product, Category> categoryJoin = root.join("category");
                predicates.add(cb.equal(categoryJoin.get("categoryId"), category));
            }
            if (color != null && !color.isEmpty()) {
                predicates.add(cb.equal(root.get("color"), color));
            }
            if (size != null && !size.isEmpty()) {
                predicates.add(cb.equal(root.get("sizes"), size));
            }
            if (minPrice != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("sellingPrice"), minPrice));
            }
            if (maxPrice != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("sellingPrice"), maxPrice));
            }
            if (minDiscount != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("discountPercent"), minDiscount));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        Pageable pageable;

        if (sort != null && !sort.isEmpty()) {
            pageable = switch (sort) {
                case "price_low" ->
                    PageRequest.of(pageNumber != null ? pageNumber : 0, 10, Sort.by("sellingPrice").ascending());
                case "price_high" ->
                    PageRequest.of(pageNumber != null ? pageNumber : 0, 10, Sort.by("sellingPrice").descending());
                default ->
                    PageRequest.of(pageNumber != null ? pageNumber : 0, 10);
            };
        } else {
            pageable = PageRequest.of(pageNumber != null ? pageNumber : 0, 10);
        }

        return productRepository.findAll(spec, pageable);
    }

    @Override
    public List<Product> getProductBySellerId(Long sellerId) {
        return productRepository.findBySellerId(sellerId);
    }
}
