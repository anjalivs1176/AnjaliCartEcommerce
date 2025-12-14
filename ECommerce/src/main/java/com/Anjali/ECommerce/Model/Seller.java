package com.Anjali.ECommerce.Model;

import com.Anjali.ECommerce.Domain.AccountStatus;
import com.Anjali.ECommerce.Domain.USER_ROLE;

import jakarta.persistence.Column;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import jakarta.persistence.AttributeOverride;
import jakarta.persistence.AttributeOverrides;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
public class Seller {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long Id;

    private String sellerName;

    private String mobile;

    @Column(unique = true, nullable = false)
    private String email;
    private String password;

    @Embedded
    private BusinessDetails businessDetails = new BusinessDetails();

    @Embedded
    private BankDetails bankDetails = new BankDetails();

    @Embedded
    @AttributeOverrides({
        @AttributeOverride(name = "name", column = @Column(name = "pickup_name")),
        @AttributeOverride(name = "locality", column = @Column(name = "pickup_locality")),
        @AttributeOverride(name = "address", column = @Column(name = "pickup_address")),
        @AttributeOverride(name = "city", column = @Column(name = "pickup_city")),
        @AttributeOverride(name = "state", column = @Column(name = "pickup_state")),
        @AttributeOverride(name = "pinCode", column = @Column(name = "pickup_pinCode")),
        @AttributeOverride(name = "mobile", column = @Column(name = "pickup_mobile"))
    })
    private Address pickupAddress = new Address();

    private String gstin;

    private USER_ROLE role = USER_ROLE.ROLE_SELLER;

    private boolean isEmailVerified;

    private AccountStatus accountStatus = AccountStatus.PENDING_VERIFICATION;

}
