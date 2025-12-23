package io.fintrack.repository;

import io.fintrack.model.EntryType;
import io.fintrack.model.Expense;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    List<Expense> findByTxnDate(LocalDate date);

    List<Expense> findByTxnDateBetween(LocalDate from, LocalDate to);

    Page<Expense> findByTxnDateBetween(LocalDate from, LocalDate to, Pageable pageable);

    @Query("SELECT COALESCE(SUM(e.amount), 0) FROM Expense e WHERE e.entryType = :entryType AND e.txnDate >= :startDate AND e.txnDate <= :endDate")
    BigDecimal sumAmountByEntryTypeAndDateRange(
            @Param("entryType") EntryType entryType,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);
}