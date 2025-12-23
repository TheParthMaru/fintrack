package io.fintrack.controller;

import io.fintrack.model.Category;
import io.fintrack.service.CategoryService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/categories")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    // GET /api/v1/categories?prefix=gr
    @GetMapping
    public List<Category> searchCategories(
            @RequestParam(required = false) String prefix) {
        return categoryService.searchByPrefix(prefix);
    }
}
