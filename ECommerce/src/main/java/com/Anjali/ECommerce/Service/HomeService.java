package com.Anjali.ECommerce.Service;

import com.Anjali.ECommerce.Model.Home;
import com.Anjali.ECommerce.Model.HomeCategory;

import java.util.List;

public interface HomeService {

    public Home createHomePageData(List<HomeCategory> allCategories);
}
