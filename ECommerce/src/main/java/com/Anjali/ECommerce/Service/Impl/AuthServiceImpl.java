package com.Anjali.ECommerce.Service.Impl;

import com.Anjali.ECommerce.Domain.USER_ROLE;
import com.Anjali.ECommerce.Model.Cart;
import com.Anjali.ECommerce.Model.Seller;
import com.Anjali.ECommerce.Model.User;
import com.Anjali.ECommerce.Model.VerificationCode;
import com.Anjali.ECommerce.Repository.CartRepository;
import com.Anjali.ECommerce.Repository.SellerRepository;
import com.Anjali.ECommerce.Repository.UserRepository;
import com.Anjali.ECommerce.Repository.VerificationCodeRepository;
import com.Anjali.ECommerce.Request.LoginRequest;
import com.Anjali.ECommerce.Service.AuthService;
import com.Anjali.ECommerce.Service.EmailService;
import com.Anjali.ECommerce.config.JwtProvider;
import com.Anjali.ECommerce.response.AuthResponse;
import com.Anjali.ECommerce.response.SignupRequest;
import com.Anjali.ECommerce.utils.OtpUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collection;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final CartRepository cartRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;
    private final VerificationCodeRepository verificationCodeRepository;
    private final EmailService emailService;
    private final CustomUserServiceImpl customUserService;
    private final SellerRepository sellerRepository;

    @Override
    public AuthResponse loginSeller(LoginRequest req) throws Exception {

        Seller seller = sellerRepository.findByEmail(req.getEmail());
        if (seller == null) {
            throw new Exception("Seller not found");
        }

        if (!passwordEncoder.matches(req.getPassword(), seller.getPassword())) {
            throw new Exception("Invalid Credentials");
        }

        Authentication auth = new UsernamePasswordAuthenticationToken(
                req.getEmail(),
                null,
                List.of(new SimpleGrantedAuthority("ROLE_SELLER"))
        );

        String token = jwtProvider.generateToken(auth);

        AuthResponse response = new AuthResponse();
        response.setJwt(token);
        response.setName(seller.getSellerName());
        response.setRole(USER_ROLE.ROLE_SELLER);
        response.setMessage("Login successful");

        return response;
    }

    @Override
    @Transactional
    public String sendLoginAndSignupOtp(String email, USER_ROLE role) throws Exception {

        String SIGNIN_PREFIX = "signin_";
        boolean isLogin = false;

        if (email.startsWith(SIGNIN_PREFIX)) {
            isLogin = true;
            email = email.substring(SIGNIN_PREFIX.length());

            User user = userRepository.findByEmail(email);
            if (user == null) {
                throw new Exception("User doesn't exist with this email");
            }
        }

        if (!isLogin) {
            User existingUser = userRepository.findByEmail(email);
            if (existingUser != null) {
                throw new Exception("User already exists with this email");
            }
        }

        // Delete existing OTP(s)
        verificationCodeRepository.deleteByEmail(email);

        String otp = OtpUtil.generateOtp();

        VerificationCode vc = new VerificationCode();
        vc.setEmail(email);
        vc.setOtp(otp);
        verificationCodeRepository.save(vc);

        emailService.sendVerificationOtpEmail(
                email,
                otp,
                "AnjaliCart Login/Signup OTP",
                "Your OTP is: " + otp
        );

        return SIGNIN_PREFIX;
    }

    @Override
    @Transactional
    public String createUser(SignupRequest req) throws Exception {

        // Accept that repository may return multiple; pick latest if list
        List<VerificationCode> vcs = verificationCodeRepository.findByEmail(req.getEmail());
        VerificationCode vc = (vcs == null || vcs.isEmpty()) ? null : vcs.get(vcs.size() - 1);

        if (vc == null || !vc.getOtp().equals(req.getOtp())) {
            throw new Exception("Invalid OTP");
        }

        // Delete OTP(s)
        verificationCodeRepository.deleteByEmail(req.getEmail());

        User user = userRepository.findByEmail(req.getEmail());
        if (user == null) {

            User newUser = new User();
            newUser.setEmail(req.getEmail());
            newUser.setName(req.getName());
            newUser.setMobile(req.getMobile());
            newUser.setRole(USER_ROLE.ROLE_CUSTOMER);
            newUser.setPassword(passwordEncoder.encode(req.getOtp()));

            user = userRepository.save(newUser);

            Cart cart = new Cart();
            cart.setUser(user);
            cartRepository.save(cart);
        }

        Authentication auth = new UsernamePasswordAuthenticationToken(
                req.getEmail(), null,
                List.of(new SimpleGrantedAuthority(USER_ROLE.ROLE_CUSTOMER.toString()))
        );

        return jwtProvider.generateToken(auth);
    }

    @Override
    @Transactional
    public AuthResponse signing(LoginRequest req) {

        String username = req.getEmail();
        String otp = req.getOtp();

        Authentication authentication = authenticate(username, otp);
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // String token = jwtProvider.generateToken(authentication);
        String token = jwtProvider.generateToken(authentication);

        AuthResponse authResponse = new AuthResponse();
        authResponse.setJwt(token);
        authResponse.setMessage("Login Success");

        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        String rolename = authorities.iterator().next().getAuthority();
        authResponse.setRole(USER_ROLE.valueOf(rolename));

        // attempt to set name from User first, then Seller
        User userObj = userRepository.findByEmail(username);
        if (userObj != null) {
            authResponse.setName(userObj.getName());
        } else {
            Seller sellerObj = sellerRepository.findByEmail(username);
            if (sellerObj != null) {
                authResponse.setName(sellerObj.getSellerName());
            } else {
                authResponse.setName(""); // fallback
            }
        }

        return authResponse;
    }

    private Authentication authenticate(String username, String otp) {

        // 1) Attempt to load UserDetails via existing custom service
        UserDetails userDetails = null;
        try {
            userDetails = customUserService.loadUserByUsername(username);
        } catch (Exception ignored) {
        }

        // 2) If customUserService didn't find a user, try to build details for seller
        if (userDetails == null) {
            Seller seller = sellerRepository.findByEmail(username);
            if (seller != null) {
                // build UserDetails for seller (no password needed for OTP flow)
                userDetails = org.springframework.security.core.userdetails.User
                        .withUsername(username)
                        .password("") // not used in OTP flow
                        .authorities(new SimpleGrantedAuthority(seller.getRole().toString()))
                        .accountLocked(false)
                        .disabled(false)
                        .build();
            }
        }

        if (userDetails == null) {
            throw new BadCredentialsException("Invalid username");
        }

        // Retrieve verification codes (repository returns list — pick latest)
        List<VerificationCode> codes = verificationCodeRepository.findByEmail(username);
        VerificationCode vc = (codes == null || codes.isEmpty()) ? null : codes.get(codes.size() - 1);

        if (vc == null || !vc.getOtp().equals(otp)) {
            throw new BadCredentialsException("Invalid OTP");
        }

        // Delete used OTP(s)
        verificationCodeRepository.deleteByEmail(username);

        return new UsernamePasswordAuthenticationToken(
                userDetails,
                null,
                userDetails.getAuthorities()
        );
    }
}
