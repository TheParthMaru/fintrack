package io.fintrack.repository;

import io.fintrack.model.Expense;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    // You can define custom queries here if needed

    String testQuery = "SELECT * FROM expenses;";
}