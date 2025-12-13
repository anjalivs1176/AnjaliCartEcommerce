package com.Anjali.ECommerce.Service;

import com.Anjali.ECommerce.Model.User;

public interface UserService {

    User findUserByJwtToken(String jwtToken) throws Exception;
    User findUserByEmail(String email) throws Exception;
    User saveUser(User user);

}
