package io.fintrack.service;

import io.fintrack.model.Category;
import io.fintrack.repository.CategoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public List<Category> searchByPrefix(String prefix) {
        if (prefix == null || prefix.isBlank()) {
            return categoryRepository.findAll();
        }
        return categoryRepository.findByNameStartingWithIgnoreCase(prefix);
    }
}
