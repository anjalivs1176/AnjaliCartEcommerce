package com.Anjali.ECommerce.Service;

import java.util.List;

import com.Anjali.ECommerce.Model.HomeCategory;

public interface HomeCategoryService {

    HomeCategory createHomeCategory(HomeCategory homeCategory);

    List<HomeCategory> createCategories(List<HomeCategory> homeCategories);

    HomeCategory updateHomeCategory(HomeCategory homeCategory, Long id) throws Exception;

    List<HomeCategory> getAllHomeCategories();

    void deleteCategory(Long id) throws Exception;
}
