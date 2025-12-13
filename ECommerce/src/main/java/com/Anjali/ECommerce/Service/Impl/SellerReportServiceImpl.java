package com.Anjali.ECommerce.Service.Impl;

import com.Anjali.ECommerce.Model.Seller;
import com.Anjali.ECommerce.Model.SellerReport;
import com.Anjali.ECommerce.Repository.SellerReportRepository;
import com.Anjali.ECommerce.Service.SellerReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SellerReportServiceImpl implements SellerReportService {

    private final SellerReportRepository sellerReportRepository;

    /**
     * Retrieve a seller report. If it doesn't exist, create a new report for the seller.
     */
    @Override
    public SellerReport getSellerReport(Seller seller) {
        SellerReport sr = sellerReportRepository.findBySellerId(seller.getId());

        if(sr == null) {
            // Initialize a new report if none exists
            SellerReport newReport = new SellerReport();
            newReport.setSeller(seller);
            return sellerReportRepository.save(newReport);
        }
        return sr;
    }

    /**
     * Update an existing seller report.
     */
    @Override
    public SellerReport updateSellerReport(SellerReport sellerReport) {
        return sellerReportRepository.save(sellerReport);
    }
}
