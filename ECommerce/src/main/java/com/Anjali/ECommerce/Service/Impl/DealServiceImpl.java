package com.Anjali.ECommerce.Service.Impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.Anjali.ECommerce.Model.Deal;
import com.Anjali.ECommerce.Repository.DealRepository;
import com.Anjali.ECommerce.Service.DealService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DealServiceImpl implements DealService {

    private final DealRepository dealRepository;

    // Get all deals
    @Override
    public List<Deal> getDeals() {
        return dealRepository.findAll();
    }

    // Create deal (NO HomeCategory reference)
    @Override
    public Deal createDeal(Deal deal) {
        return dealRepository.save(deal);
    }

    // Update deal
    @Override
    public Deal updateDeal(Deal updatedDeal, Long id) throws Exception {
        Deal existing = dealRepository.findById(id)
                .orElseThrow(() -> new Exception("Deal not found"));

        if (updatedDeal.getTitle() != null)
            existing.setTitle(updatedDeal.getTitle());

        if (updatedDeal.getImage() != null)
            existing.setImage(updatedDeal.getImage());

        if (updatedDeal.getDiscount() != null)
            existing.setDiscount(updatedDeal.getDiscount());

        if (updatedDeal.getCategoryId() != null)
            existing.setCategoryId(updatedDeal.getCategoryId());

        return dealRepository.save(existing);
    }

    // Delete deal
    @Override
    public void deleteDeal(Long id) throws Exception {
        Deal deal = dealRepository.findById(id)
                .orElseThrow(() -> new Exception("Deal not found"));
        dealRepository.delete(deal);
    }
}
