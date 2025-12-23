package io.fintrack.controller;

import io.fintrack.model.Merchant;
import io.fintrack.service.MerchantService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/merchants")
public class MerchantController {

    private final MerchantService merchantService;

    public MerchantController(MerchantService merchantService) {
        this.merchantService = merchantService;
    }

    // GET /api/v1/merchants?prefix=tes
    @GetMapping
    public List<Merchant> searchMerchants(
            @RequestParam(required = false) String prefix) {
        return merchantService.searchByPrefix(prefix);
    }
}
