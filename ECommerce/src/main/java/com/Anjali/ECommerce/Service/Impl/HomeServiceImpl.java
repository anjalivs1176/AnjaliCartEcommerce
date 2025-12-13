package com.Anjali.ECommerce.Service.Impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.Anjali.ECommerce.Domain.HomeCategorySection;
import com.Anjali.ECommerce.Model.Deal;
import com.Anjali.ECommerce.Model.Home;
import com.Anjali.ECommerce.Model.HomeCategory;
import com.Anjali.ECommerce.Repository.DealRepository;
import com.Anjali.ECommerce.Service.HomeService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class HomeServiceImpl implements HomeService {

    // Repository for CRUD operations on Deals
    private final DealRepository dealRepository;

    /**
     * Create home page data by categorizing HomeCategories into different
     * sections. Also fetches or creates deals for the DEALS section.
     */
    @Override
    public Home createHomePageData(List<HomeCategory> allCategories) {

        // GRID
        List<HomeCategory> gridCategories = allCategories.stream()
                .filter(category -> category.getSection() == HomeCategorySection.GRID)
                .collect(Collectors.toList());

        // SHOP BY CATEGORY
        List<HomeCategory> shopByCategories = allCategories.stream()
                .filter(category -> category.getSection() == HomeCategorySection.SHOP_BY_CATEGORIES)
                .collect(Collectors.toList());

        // ELECTRIC
        List<HomeCategory> electricCategories = allCategories.stream()
                .filter(category -> category.getSection() == HomeCategorySection.ELECTRIC_CATEGORIES)
                .collect(Collectors.toList());

        // DEAL SECTION CATEGORIES
        List<HomeCategory> dealCategories = allCategories.stream()
                .filter(category -> category.getSection() == HomeCategorySection.DEALS)
                .collect(Collectors.toList());

        List<Deal> deals;

        // If no deals exist → create default deals
        if (dealRepository.findAll().isEmpty()) {
            deals = dealCategories.stream()
                    .map(c -> new Deal(
                    null,
                    "Special Offer",
                    c.getImage(),
                    10,
                    c.getCategoryId()
            ))
                    .collect(Collectors.toList());

            deals = dealRepository.saveAll(deals);
        } else {
            deals = dealRepository.findAll();
        }

        // Build Home Response
        Home home = new Home();
        home.setGrid(gridCategories);
        home.setShopByCategories(shopByCategories);
        home.setElectricCategories(electricCategories);
        home.setDeals(deals);
        home.setDealCategories(dealCategories);

        return home;
    }

}
