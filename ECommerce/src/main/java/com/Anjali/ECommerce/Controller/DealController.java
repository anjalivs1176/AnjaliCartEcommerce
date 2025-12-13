package com.Anjali.ECommerce.Controller;

import com.Anjali.ECommerce.Model.Deal;
import com.Anjali.ECommerce.Repository.DealRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/deals")
@RequiredArgsConstructor
public class DealController {

    private final DealRepository dealRepository;

    @PostMapping
    public ResponseEntity<Deal> create(@RequestBody Deal deal) {
        return ResponseEntity.ok(dealRepository.save(deal));
    }

    @GetMapping
    public ResponseEntity<List<Deal>> getAll() {
        return ResponseEntity.ok(dealRepository.findAll());
    }

    @PatchMapping("/{id}")
    public ResponseEntity<Deal> update(@PathVariable Long id, @RequestBody Deal update) {
        Deal d = dealRepository.findById(id).orElseThrow();

        if (update.getTitle() != null) {
            d.setTitle(update.getTitle());
        }
        if (update.getImage() != null) {
            d.setImage(update.getImage());
        }
        if (update.getDiscount() != null) {
            d.setDiscount(update.getDiscount());
        }
        if (update.getCategoryId() != null) {
            d.setCategoryId(update.getCategoryId());
        }

        return ResponseEntity.ok(dealRepository.save(d));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        dealRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
