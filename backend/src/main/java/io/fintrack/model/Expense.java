package io.fintrack.model;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "expense")
public class Expense {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "txn_date", nullable = false)
    private LocalDate txnDate;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal amount;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String item;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category; // nullable in DB → can be null in Java too

    @ManyToOne
    @JoinColumn(name = "merchant_id")
    private Merchant merchant; // nullable

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_method", nullable = false, length = 30)
    private PaymentMethod paymentMethod;

    @Column(name = "bank")
    private String bank;

    @Column(name = "paid_by", nullable = false, length = 50)
    private String paidBy;

    @Enumerated(EnumType.STRING)
    @Column(name = "entry_type", nullable = false, length = 10)
    private EntryType entryType;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    public Expense() {
        // required by JPA
    }

    public Expense(LocalDate txnDate,
            BigDecimal amount,
            String item,
            Category category,
            Merchant merchant,
            PaymentMethod paymentMethod,
            String paidBy,
            EntryType entryType,
            String notes) {
        this.txnDate = txnDate;
        this.amount = amount;
        this.item = item;
        this.category = category;
        this.merchant = merchant;
        this.paymentMethod = paymentMethod;
        this.paidBy = paidBy;
        this.entryType = entryType;
        this.notes = notes;
    }

    @PrePersist
    public void prePersist() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }

    // Getters and setters

    public Long getId() {
        return id;
    }

    public LocalDate getTxnDate() {
        return txnDate;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public String getItem() {
        return item;
    }

    public Category getCategory() {
        return category;
    }

    public Merchant getMerchant() {
        return merchant;
    }

    public PaymentMethod getPaymentMethod() {
        return paymentMethod;
    }

    public String getBank() {
        return bank;
    }

    public void setBank(String bank) {
        this.bank = bank;
    }

    public String getPaidBy() {
        return paidBy;
    }

    public EntryType getEntryType() {
        return entryType;
    }

    public String getNotes() {
        return notes;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setTxnDate(LocalDate txnDate) {
        this.txnDate = txnDate;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public void setItem(String item) {
        this.item = item;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public void setMerchant(Merchant merchant) {
        this.merchant = merchant;
    }

    public void setPaymentMethod(PaymentMethod paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public void setPaidBy(String paidBy) {
        this.paidBy = paidBy;
    }

    public void setEntryType(EntryType entryType) {
        this.entryType = entryType;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
