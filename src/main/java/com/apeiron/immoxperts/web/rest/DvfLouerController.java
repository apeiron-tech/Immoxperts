package com.apeiron.immoxperts.web.rest;

import com.apeiron.immoxperts.service.DvfLouerService;
import com.apeiron.immoxperts.service.dto.DvfLouerDto;
import java.math.BigDecimal;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/louer")
public class DvfLouerController {

    private final DvfLouerService service;

    public DvfLouerController(DvfLouerService service) {
        this.service = service;
    }

    @GetMapping
    public List<DvfLouerDto> getAll() {
        return service.getAllLouers();
    }

    @GetMapping("/by-postal")
    public List<DvfLouerDto> getByPostalCode(@RequestParam("postalCode") String postalCode) {
        return service.getLouersByPostalCode(postalCode);
    }

    @GetMapping("/search")
    public List<DvfLouerDto> searchLouers(
        @RequestParam(value = "postalCode", required = false) String postalCode,
        @RequestParam(value = "price", required = false) BigDecimal price,
        @RequestParam(value = "propertyType") String propertyType
    ) {
        return service.searchLouers(postalCode, price, propertyType);
    }
}
