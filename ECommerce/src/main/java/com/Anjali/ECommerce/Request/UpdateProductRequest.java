package com.Anjali.ECommerce.Request;

import lombok.Data;
import java.util.List;

@Data
public class UpdateProductRequest {
    private String title;
    private String description;
    private int mrpPrice;
    private int sellingPrice;
    private String color;
    private List<String> images;
    private String size;

    private String category;   
    private String category2;
    private String category3;
}

