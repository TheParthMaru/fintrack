package io.fintrack.dto;

import io.fintrack.model.EntryType;
import io.fintrack.model.PaymentMethod;

import java.math.BigDecimal;
import java.time.LocalDate;

public class CreateExpenseRequest {

    private LocalDate txnDate;
    private BigDecimal amount;
    private String item;

    // category & merchant are passed by NAME from the UI
    private String categoryName;
    private String merchantName;

    private PaymentMethod paymentMethod;
    private String bank;
    private String paidBy;
    private EntryType entryType;

    private String notes;

    public CreateExpenseRequest() {
        // default constructor for JSON deserialization
    }

    // Getters and setters

    public LocalDate getTxnDate() {
        return txnDate;
    }

    public void setTxnDate(LocalDate txnDate) {
        this.txnDate = txnDate;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getItem() {
        return item;
    }

    public void setItem(String item) {
        this.item = item;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public String getMerchantName() {
        return merchantName;
    }

    public void setMerchantName(String merchantName) {
        this.merchantName = merchantName;
    }

    public String getBank() {
        return bank;
    }

    public void setBank(String bank) {
        this.bank = bank;
    }

    public PaymentMethod getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(PaymentMethod paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public String getPaidBy() {
        return paidBy;
    }

    public void setPaidBy(String paidBy) {
        this.paidBy = paidBy;
    }

    public EntryType getEntryType() {
        return entryType;
    }

    public void setEntryType(EntryType entryType) {
        this.entryType = entryType;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}
