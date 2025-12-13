package com.Anjali.ECommerce.Model;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Embeddable
@Data
public class BankDetails {

    private String accountNumber;

    private String accountHolderName;

    private String ifscCode;

}
