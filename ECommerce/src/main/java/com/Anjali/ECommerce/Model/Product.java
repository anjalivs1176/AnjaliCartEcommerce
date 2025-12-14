package com.Anjali.ECommerce.Model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long Id;

    private String title;

    private String description;

    private int mrpPrice;

    private int sellingPrice;

    private int discountPercent;

    private int quantity;

    private String stockStatus = "IN_STOCK";

    private String color;

    //this will create separate table for images
    @ElementCollection
    private List<String> images = new ArrayList<>();

    private int numRatings;

    //one category has multiple products
    @ManyToOne
    private Category category;

    //one seller can sell multiple products
    @ManyToOne
    private Seller seller;

    private LocalDateTime createdAt;
    //@ElementCollection
    private String sizes;

    //one product have many reviews
    @OneToMany(mappedBy = "product",cascade = CascadeType.ALL ,orphanRemoval = true)
    private List<Review> reviews = new ArrayList<>();

}
