package com.tunabooking.hotel_manager_api.service;

import com.tunabooking.hotel_manager_api.config.JwtService;
import com.tunabooking.hotel_manager_api.dto.request.AuthRequest;
import com.tunabooking.hotel_manager_api.dto.request.RegisterRequest;
import com.tunabooking.hotel_manager_api.dto.response.AuthResponse;
import com.tunabooking.hotel_manager_api.entity.Role;
import com.tunabooking.hotel_manager_api.entity.User;
import com.tunabooking.hotel_manager_api.exception.UserNotFoundException;
import com.tunabooking.hotel_manager_api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

        private final UserRepository userRepository;
        private final PasswordEncoder passwordEncoder;
        private final JwtService jwtService;
        private final AuthenticationManager authenticationManager;

        public AuthResponse register(RegisterRequest request) {
                if (userRepository.findByEmail(request.getEmail()).isPresent()) {
                        throw new RuntimeException("Email already exists");
                }

                var user = User.builder()
                                .name(request.getName())
                                .email(request.getEmail())
                                .password(passwordEncoder.encode(request.getPassword()))
                                .role(Role.USER) // Default role
                                .build();

                userRepository.save(user);
                
                var extraClaims = new java.util.HashMap<String, Object>();
                extraClaims.put("roles", java.util.List.of("ROLE_" + user.getRole().name()));
                var jwtToken = jwtService.generateToken(extraClaims, user);

                return AuthResponse.builder()
                                .token(jwtToken)
                                .build();
        }

        public AuthResponse login(AuthRequest request) {
                authenticationManager.authenticate(
                                new UsernamePasswordAuthenticationToken(
                                                request.getEmail(),
                                                request.getPassword()));

                var user = userRepository.findByEmail(request.getEmail())
                                .orElseThrow(() -> new UserNotFoundException("User not found"));

                var extraClaims = new java.util.HashMap<String, Object>();
                extraClaims.put("roles", java.util.List.of("ROLE_" + user.getRole().name()));
                var jwtToken = jwtService.generateToken(extraClaims, user);

                return AuthResponse.builder()
                                .token(jwtToken)
                                .build();
        }
}
