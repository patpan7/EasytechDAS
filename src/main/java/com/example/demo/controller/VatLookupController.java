package com.example.demo.controller;

import com.example.demo.dto.VatLookupResponse;
import com.example.demo.service.AadeVatLookupService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/vat-lookup")
public class VatLookupController {

    private final AadeVatLookupService aadeVatLookupService;

    public VatLookupController(AadeVatLookupService aadeVatLookupService) {
        this.aadeVatLookupService = aadeVatLookupService;
    }

    @GetMapping("/{afm}")
    @PreAuthorize("hasAnyRole('SUPERVISOR', 'PARTNER')")
    public ResponseEntity<VatLookupResponse> lookupAfm(@PathVariable String afm) {
        VatLookupResponse response = aadeVatLookupService.lookupAfm(afm);
        if (response != null) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
