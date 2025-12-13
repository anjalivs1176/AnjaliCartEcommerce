package com.Anjali.ECommerce.Service;

import com.Anjali.ECommerce.Model.Seller;
import com.Anjali.ECommerce.Model.SellerReport;

public interface SellerReportService {

    SellerReport getSellerReport(Seller seller);
    SellerReport updateSellerReport(SellerReport sellerReport);
}
