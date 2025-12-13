package com.Anjali.ECommerce.Repository;

import java.util.List;

import com.Anjali.ECommerce.Model.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface  CategoryRepository extends JpaRepository<Category,Long> {

    Category findByCategoryId(String categoryId);

    List<Category> findByShowOnHomeTrue();

}
