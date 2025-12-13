package com.Anjali.ECommerce.Service.Impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.Anjali.ECommerce.Model.Category;
import com.Anjali.ECommerce.Repository.CategoryRepository;
import com.Anjali.ECommerce.Service.CategoryService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    @Override
    public Category createCategory(Category category) {
        return categoryRepository.save(category);
    }

    @Override
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    @Override
    public Category getCategoryById(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));
    }

    @Override
    public void deleteCategory(Long id) {
        categoryRepository.deleteById(id);
    }


    @Override
public Category updateCategory(Long id, Category req) {

    Category category = categoryRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Category not found"));

    // Update fields only if they are provided
    if (req.getName() != null) category.setName(req.getName());
    if (req.getLevel() != null) category.setLevel(req.getLevel());
    if (req.getDiscount() != null) category.setDiscount(req.getDiscount());
    if (req.getImage() != null) category.setImage(req.getImage());
    if (req.getCategoryId() != null) category.setCategoryId(req.getCategoryId());
    if (req.getParentCategory() != null) category.setParentCategory(req.getParentCategory());

    return categoryRepository.save(category);
}


@Override
public List<Category> getHomeCategories() {
    return categoryRepository.findByShowOnHomeTrue();
}


}
