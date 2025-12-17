package com.Anjali.ECommerce.Repository;

import java.util.Optional;
import com.Anjali.ECommerce.Model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {

    User findByEmail(String email);

    boolean existsByEmail(String email);
}
