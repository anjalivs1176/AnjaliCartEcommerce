package com.Anjali.ECommerce.Service.Impl;

import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.Anjali.ECommerce.Domain.AccountStatus;
import com.Anjali.ECommerce.Domain.USER_ROLE;
import com.Anjali.ECommerce.Model.Address;
import com.Anjali.ECommerce.Model.Seller;
import com.Anjali.ECommerce.Repository.SellerRepository;
import com.Anjali.ECommerce.Service.SellerService;
import com.Anjali.ECommerce.config.JwtProvider;
import com.Anjali.ECommerce.exception.SellerException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SellerServiceImpl implements SellerService {

    private final SellerRepository sellerRepository;
    private final JwtProvider jwtProvider;
    private final PasswordEncoder passwordEncoder;

    @Override
    public Seller getSellerProfile(String jwt) throws Exception {
        String email = jwtProvider.getEmailFromJwtToken(jwt);
        return getSellerByEmail(email);
    }

    @Override
    public Seller createSeller(Seller seller) throws Exception {

        Seller exists = sellerRepository.findByEmail(seller.getEmail());
        if (exists != null) {
            throw new Exception("Email Already Exists. Use Different Email.");
        }

        // pickupAddress is @Embedded now → no need to save separately
        Address pickup = seller.getPickupAddress();

        Seller newSeller = new Seller();
        newSeller.setEmail(seller.getEmail());
        newSeller.setPassword(passwordEncoder.encode(seller.getPassword()));
        newSeller.setSellerName(seller.getSellerName());
        newSeller.setPickupAddress(pickup);
        newSeller.setMobile(seller.getMobile());
        newSeller.setGstin(seller.getGstin());
        newSeller.setBankDetails(seller.getBankDetails());
        newSeller.setBusinessDetails(seller.getBusinessDetails());
        newSeller.setRole(USER_ROLE.ROLE_SELLER);
        newSeller.setEmailVerified(false);
        newSeller.setAccountStatus(AccountStatus.PENDING_VERIFICATION);

        return sellerRepository.save(newSeller);
    }

    @Override
    public Seller getSellerById(Long id) throws SellerException {
        return sellerRepository.findById(id)
                .orElseThrow(() -> new SellerException("Seller Not Found with id: " + id));
    }

    @Override
    public Seller getSellerByEmail(String email) throws Exception {
        Seller seller = sellerRepository.findByEmail(email);
        if (seller == null) {
            throw new Exception("Seller not found for email: " + email);
        }
        return seller;
    }

    @Override
    public List<Seller> getAllSellers(AccountStatus stats) {
        return sellerRepository.findByAccountStatus(stats);
    }

    @Override
    public Seller updateSeller(Long id, Seller update) throws Exception {

        Seller seller = getSellerById(id);

        if (update.getSellerName() != null) {
            seller.setSellerName(update.getSellerName());
        }
        if (update.getMobile() != null) {
            seller.setMobile(update.getMobile());
        }
        if (update.getEmail() != null) {
            seller.setEmail(update.getEmail());
        }
        if (update.getGstin() != null) {
            seller.setGstin(update.getGstin());
        }

        if (update.getBusinessDetails() != null) {
            seller.getBusinessDetails().setBusinessName(update.getBusinessDetails().getBusinessName());
            seller.getBusinessDetails().setBusinessEmail(update.getBusinessDetails().getBusinessEmail());
            seller.getBusinessDetails().setBusinessMobile(update.getBusinessDetails().getBusinessMobile());
            seller.getBusinessDetails().setBusinessAddress(update.getBusinessDetails().getBusinessAddress());
            seller.getBusinessDetails().setLogo(update.getBusinessDetails().getLogo());
            seller.getBusinessDetails().setBanner(update.getBusinessDetails().getBanner());
        }

        if (update.getBankDetails() != null) {
            seller.getBankDetails().setAccountHolderName(update.getBankDetails().getAccountHolderName());
            seller.getBankDetails().setAccountNumber(update.getBankDetails().getAccountNumber());
            seller.getBankDetails().setIfscCode(update.getBankDetails().getIfscCode());
        }

        if (update.getPickupAddress() != null) {
            seller.getPickupAddress().setName(update.getPickupAddress().getName());
            seller.getPickupAddress().setLocality(update.getPickupAddress().getLocality());
            seller.getPickupAddress().setAddress(update.getPickupAddress().getAddress());
            seller.getPickupAddress().setCity(update.getPickupAddress().getCity());
            seller.getPickupAddress().setState(update.getPickupAddress().getState());
            seller.getPickupAddress().setPinCode(update.getPickupAddress().getPinCode());
            seller.getPickupAddress().setMobile(update.getPickupAddress().getMobile());
        }

        return sellerRepository.save(seller);
    }

    @Override
    public void deleteSeller(Long id) throws Exception {
        Seller seller = getSellerById(id);
        sellerRepository.delete(seller);
    }

    @Override
    public Seller verifyEmail(String email, String otp) throws Exception {
        Seller seller = getSellerByEmail(email);
        seller.setEmailVerified(true);
        seller.setAccountStatus(AccountStatus.ACTIVE);
        return sellerRepository.save(seller);
    }

    @Override
    public Seller updateSellerAccountStatus(Long sellerId, AccountStatus status) throws Exception {
        Seller seller = getSellerById(sellerId);
        seller.setAccountStatus(status);
        return sellerRepository.save(seller);
    }

    @Override
    public List<Seller> getSellersByStatus(AccountStatus status) {
        return sellerRepository.findByAccountStatus(status);
    }

}
