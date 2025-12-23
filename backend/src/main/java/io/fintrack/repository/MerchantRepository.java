package io.fintrack.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import io.fintrack.model.Merchant;

public interface MerchantRepository extends JpaRepository<Merchant, Long> {
    Optional<Merchant> findByNameIgnoreCase(String name);

    List<Merchant> findByNameStartingWithIgnoreCase(String prefix);
}
