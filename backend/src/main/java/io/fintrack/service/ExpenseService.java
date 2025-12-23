package io.fintrack.service;

import io.fintrack.dto.CreateExpenseRequest;
import io.fintrack.dto.MonthlyAnalyticsResponse;
import io.fintrack.model.Category;
import io.fintrack.model.EntryType;
import io.fintrack.model.Expense;
import io.fintrack.model.Merchant;
import io.fintrack.repository.CategoryRepository;
import io.fintrack.repository.ExpenseRepository;
import io.fintrack.repository.MerchantRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Objects;

@Service
public class ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final CategoryRepository categoryRepository;
    private final MerchantRepository merchantRepository;

    public ExpenseService(ExpenseRepository expenseRepository,
            CategoryRepository categoryRepository,
            MerchantRepository merchantRepository) {
        this.expenseRepository = expenseRepository;
        this.categoryRepository = categoryRepository;
        this.merchantRepository = merchantRepository;
    }

    @Transactional
    public Expense createExpense(CreateExpenseRequest request) {
        // Basic sanity checks (you can make this stricter later)
        if (request.getTxnDate() == null) {
            request.setTxnDate(LocalDate.now());
        }
        if (request.getItem() == null || request.getItem().isBlank()) {
            throw new IllegalArgumentException("Item must not be empty");
        }

        // Handle category (optional, create if not exists)
        Category category = null;
        String categoryName = normalize(request.getCategoryName());
        if (categoryName != null) {
            category = categoryRepository
                    .findByNameIgnoreCase(categoryName)
                    .orElseGet(() -> {
                        Category newCategory = new Category();
                        newCategory.setName(categoryName);
                        return categoryRepository.save(newCategory);
                    });
        }

        // Handle merchant (optional, create if not exists)
        Merchant merchant = null;
        String merchantName = normalize(request.getMerchantName());
        if (merchantName != null) {
            merchant = merchantRepository
                    .findByNameIgnoreCase(merchantName)
                    .orElseGet(() -> {
                        Merchant newMerchant = new Merchant();
                        newMerchant.setName(merchantName);
                        return merchantRepository.save(newMerchant);
                    });
        }

        // Map request → Expense entity
        Expense expense = new Expense();
        expense.setTxnDate(request.getTxnDate());
        expense.setAmount(request.getAmount());
        expense.setItem(request.getItem());
        expense.setCategory(category);
        expense.setMerchant(merchant);
        expense.setBank(request.getBank());
        expense.setPaymentMethod(request.getPaymentMethod());
        expense.setPaidBy(request.getPaidBy());
        expense.setEntryType(request.getEntryType());
        expense.setNotes(request.getNotes());

        // createdAt will be set by @PrePersist in Expense
        return expenseRepository.save(expense);
    }

    private String normalize(String value) {
        if (value == null)
            return null;
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }

    public List<Expense> getAllExpenses() {
        return expenseRepository.findAll(Sort.by(Sort.Direction.DESC, "txnDate"));
    }

    public Expense getExpenseById(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("Expense id must not be null");
        }
        return expenseRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Expense not found with id: " + id));
    }

    public Page<Expense> getExpensesBetween(LocalDate from, LocalDate to, int page, int size) {
        int safePage = Math.max(page, 0);
        int safeSize = Math.min(Math.max(size, 1), 50);
        Pageable pageable = PageRequest.of(safePage, safeSize, Sort.by(Sort.Direction.DESC, "txnDate"));

        LocalDate fromDate = from;
        LocalDate toDate = to;

        if (fromDate != null && toDate == null) {
            toDate = LocalDate.now();
        }

        if (fromDate == null && toDate != null) {
            fromDate = LocalDate.of(1970, 1, 1);
        }

        if (fromDate == null && toDate == null) {
            return expenseRepository.findAll(pageable);
        }

        LocalDate normalizedFrom = Objects.requireNonNull(fromDate, "fromDate must not be null");
        LocalDate normalizedTo = Objects.requireNonNull(toDate, "toDate must not be null");

        if (normalizedFrom.isAfter(normalizedTo)) {
            LocalDate tmp = normalizedFrom;
            normalizedFrom = normalizedTo;
            normalizedTo = tmp;
        }

        return expenseRepository.findByTxnDateBetween(normalizedFrom, normalizedTo, pageable);
    }

    public MonthlyAnalyticsResponse getMonthlyAnalytics() {
        LocalDate now = LocalDate.now();
        LocalDate startOfMonth = now.withDayOfMonth(1);
        LocalDate endOfMonth = now.withDayOfMonth(now.lengthOfMonth());

        // Calculate total expenditure (DEBIT entries)
        BigDecimal totalExpenditure = expenseRepository.sumAmountByEntryTypeAndDateRange(
                EntryType.DEBIT, startOfMonth, endOfMonth);
        if (totalExpenditure == null) {
            totalExpenditure = BigDecimal.ZERO;
        }

        // Calculate total earnings (CREDIT entries)
        BigDecimal totalEarnings = expenseRepository.sumAmountByEntryTypeAndDateRange(
                EntryType.CREDIT, startOfMonth, endOfMonth);
        if (totalEarnings == null) {
            totalEarnings = BigDecimal.ZERO;
        }

        // Calculate total savings (CREDIT - DEBIT)
        BigDecimal totalSavings = totalEarnings.subtract(totalExpenditure);

        return new MonthlyAnalyticsResponse(totalExpenditure, totalEarnings, totalSavings);
    }
}
