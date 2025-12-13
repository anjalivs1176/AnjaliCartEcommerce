package com.Anjali.ECommerce.Controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.Anjali.ECommerce.Model.Home;
import com.Anjali.ECommerce.Model.HomeCategory;
import com.Anjali.ECommerce.Service.HomeCategoryService;
import com.Anjali.ECommerce.Service.HomeService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class HomeCategoryController {

    private final HomeCategoryService homeCategoryService;
    private final HomeService homeService;

    // -------- OLD: Create multiple home categories --------
    @PostMapping("/home/categories")
    public ResponseEntity<Home> createHomeCategories(
            @RequestBody List<HomeCategory> homeCategories) {

        List<HomeCategory> categories = homeCategoryService.createCategories(homeCategories);
        Home home = homeService.createHomePageData(categories);

        return new ResponseEntity<>(home, HttpStatus.ACCEPTED);
    }

    // -------- ADMIN: create single home category --------
    @PostMapping("/admin/home-category")
    public ResponseEntity<HomeCategory> createCategory(@RequestBody HomeCategory homeCategory) {
        HomeCategory saved = homeCategoryService.createHomeCategory(homeCategory);
        return ResponseEntity.ok(saved);
    }

    // -------- ADMIN: get all home categories --------
    @GetMapping("/admin/home-category")
    public ResponseEntity<List<HomeCategory>> getHomeCategory() {
        List<HomeCategory> categories = homeCategoryService.getAllHomeCategories();
        return ResponseEntity.ok(categories);
    }

    // -------- ADMIN: update home category --------
    @PatchMapping("/admin/home-category/{id}")
    public ResponseEntity<HomeCategory> updateHomeCategory(
            @PathVariable Long id,
            @RequestBody HomeCategory homeCategory) throws Exception {

        HomeCategory updated = homeCategoryService.updateHomeCategory(homeCategory, id);
        return ResponseEntity.ok(updated);
    }

    // -------- ADMIN: delete home category --------
    @DeleteMapping("/admin/home-category/{id}")
    public ResponseEntity<String> deleteCategory(@PathVariable Long id) throws Exception {
        homeCategoryService.deleteCategory(id);
        return ResponseEntity.ok("Home category deleted");
    }

    // -------- PUBLIC: home categories for homepage grid --------
    @GetMapping("/public/home-category")
    public ResponseEntity<List<HomeCategory>> getPublicHomeCategory() {
        List<HomeCategory> categories = homeCategoryService.getAllHomeCategories();
        return ResponseEntity.ok(categories);
    }
}
