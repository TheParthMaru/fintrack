package io.fintrack.dto;

import java.math.BigDecimal;

public class MonthlyAnalyticsResponse {
    private BigDecimal totalExpenditure;  // Sum of DEBIT entries for current month
    private BigDecimal totalEarnings;     // Sum of CREDIT entries for current month
    private BigDecimal totalBalance;      // CREDIT - DEBIT for current month

    public MonthlyAnalyticsResponse() {
        // default constructor for JSON deserialization
    }

    public MonthlyAnalyticsResponse(BigDecimal totalExpenditure, BigDecimal totalEarnings, BigDecimal totalBalance) {
        this.totalExpenditure = totalExpenditure;
        this.totalEarnings = totalEarnings;
        this.totalBalance = totalBalance;
    }

    // Getters and setters

    public BigDecimal getTotalExpenditure() {
        return totalExpenditure;
    }

    public void setTotalExpenditure(BigDecimal totalExpenditure) {
        this.totalExpenditure = totalExpenditure;
    }

    public BigDecimal getTotalEarnings() {
        return totalEarnings;
    }

    public void setTotalEarnings(BigDecimal totalEarnings) {
        this.totalEarnings = totalEarnings;
    }

    public BigDecimal getTotalBalance() {
        return totalBalance;
    }

    public void setTotalBalance(BigDecimal totalBalance) {
        this.totalBalance = totalBalance;
    }
}

