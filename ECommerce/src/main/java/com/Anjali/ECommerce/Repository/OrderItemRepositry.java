package com.Anjali.ECommerce.Repository;

import com.Anjali.ECommerce.Model.Order;
import com.Anjali.ECommerce.Model.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderItemRepositry extends JpaRepository<OrderItem,Long> {


}
