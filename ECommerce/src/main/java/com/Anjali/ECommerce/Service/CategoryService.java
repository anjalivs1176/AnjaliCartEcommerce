package com.Anjali.ECommerce.Service;

import java.util.List;

import com.Anjali.ECommerce.Model.Category;

public interface CategoryService {

    Category createCategory(Category category);

    List<Category> getAllCategories();

    Category getCategoryById(Long id);

    void deleteCategory(Long id);

    Category updateCategory(Long id, Category category);

    List<Category> getHomeCategories();
    


}
