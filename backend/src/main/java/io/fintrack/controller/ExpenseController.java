package io.fintrack.controller;

import io.fintrack.dto.CreateExpenseRequest;
import io.fintrack.dto.MonthlyAnalyticsResponse;
import io.fintrack.model.Expense;
import io.fintrack.service.ExpenseService;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/expenses")
public class ExpenseController {

    private final ExpenseService expenseService;

    public ExpenseController(ExpenseService expenseService) {
        this.expenseService = expenseService;
    }

    @PostMapping
    public ResponseEntity<Expense> createExpense(@RequestBody CreateExpenseRequest request) {
        Expense saved = expenseService.createExpense(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    // 1) GET /api/v1/expenses → all expenses
    @GetMapping
    public List<Expense> getAllExpenses() {
        return expenseService.getAllExpenses();
    }

    // 2) GET /api/v1/expenses/{id} → single expense
    @GetMapping("/{id}")
    public ResponseEntity<Expense> getExpenseById(@PathVariable Long id) {
        try {
            Expense expense = expenseService.getExpenseById(id);
            return ResponseEntity.ok(expense);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.notFound().build();
        }
    }

    // 3) GET /api/v1/expenses/search?from=2025-11-01&to=2025-11-30
    @GetMapping("/search")
    public ResponseEntity<Page<Expense>> getExpensesBetween(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<Expense> result = expenseService.getExpensesBetween(from, to, page, size);
        return ResponseEntity.ok(result);
    }

    // 4) GET /api/v1/expenses/analytics/monthly → monthly analytics for current
    // month
    @GetMapping("/analytics/monthly")
    public ResponseEntity<MonthlyAnalyticsResponse> getMonthlyAnalytics() {
        MonthlyAnalyticsResponse analytics = expenseService.getMonthlyAnalytics();
        return ResponseEntity.ok(analytics);
    }
}
