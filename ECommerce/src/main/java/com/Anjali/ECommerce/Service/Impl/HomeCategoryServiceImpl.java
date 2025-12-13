package com.Anjali.ECommerce.Service.Impl;

import com.Anjali.ECommerce.Model.HomeCategory;
import com.Anjali.ECommerce.Repository.CategoryRepository;
import com.Anjali.ECommerce.Repository.HomeCategoryRepository;
import com.Anjali.ECommerce.Service.HomeCategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class HomeCategoryServiceImpl implements HomeCategoryService {

    // Repository for CRUD operations on HomeCategory
    private final HomeCategoryRepository homeCategoryRepository;

    // Repository for main Category data
    private final CategoryRepository categoryRepository;

    /**
     * Create a new HomeCategory.
     */
    @Override
    public HomeCategory createHomeCategory(HomeCategory homeCategory) {
        return homeCategoryRepository.save(homeCategory);
    }

    /**
     * Create multiple HomeCategories.
     * Only saves if repository is empty, otherwise returns existing categories.
     */
    @Override
    public List<HomeCategory> createCategories(List<HomeCategory> homeCategories) {
        if(homeCategoryRepository.findAll().isEmpty()){
            return homeCategoryRepository.saveAll(homeCategories);
        }
        return homeCategoryRepository.findAll();
    }

    /**
     * Update an existing HomeCategory by ID.
     * Updates image and linked category if provided.
     */
    @Override
    public HomeCategory updateHomeCategory(HomeCategory category, Long id) throws Exception {
        HomeCategory existingCategory = homeCategoryRepository.findById(id).orElseThrow(() ->
                new Exception("Category not found"));

        if(category.getImage() != null){
            existingCategory.setImage(category.getImage());
        }
        if(category.getCategoryId() != null){
            existingCategory.setCategoryId(category.getCategoryId());
        }

        return homeCategoryRepository.save(existingCategory);
    }

    /**
     * Retrieve all HomeCategories.
     */
    @Override
    public List<HomeCategory> getAllHomeCategories() {
        return homeCategoryRepository.findAll();
    }


    @Override
public void deleteCategory(Long id) throws Exception {
    HomeCategory category = homeCategoryRepository.findById(id)
            .orElseThrow(() -> new Exception("Home category not found"));
    homeCategoryRepository.delete(category);
}

}
