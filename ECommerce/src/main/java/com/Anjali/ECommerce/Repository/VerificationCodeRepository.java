package com.Anjali.ECommerce.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.Anjali.ECommerce.Model.VerificationCode;

public interface VerificationCodeRepository extends JpaRepository<VerificationCode, Long> {

    List<VerificationCode> findByEmail(String email);

    void deleteByEmail(String email);
}
