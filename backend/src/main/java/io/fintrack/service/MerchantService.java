package io.fintrack.service;

import io.fintrack.model.Merchant;
import io.fintrack.repository.MerchantRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MerchantService {

    private final MerchantRepository merchantRepository;

    public MerchantService(MerchantRepository merchantRepository) {
        this.merchantRepository = merchantRepository;
    }

    public List<Merchant> searchByPrefix(String prefix) {
        if (prefix == null || prefix.isBlank()) {
            return merchantRepository.findAll();
        }
        return merchantRepository.findByNameStartingWithIgnoreCase(prefix);
    }
}
