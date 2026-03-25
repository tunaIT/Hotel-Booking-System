package com.tunabooking.hotel_manager_api.controller;

import com.tunabooking.hotel_manager_api.dto.request.AuthRequest;
import com.tunabooking.hotel_manager_api.dto.request.RegisterRequest;
import com.tunabooking.hotel_manager_api.dto.response.AuthResponse;
import com.tunabooking.hotel_manager_api.dto.response.ApiResponse;
import com.tunabooking.hotel_manager_api.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(
            @Valid @RequestBody RegisterRequest request
    ) {
        return ResponseEntity.ok(ApiResponse.success("User registered successfully", authService.register(request)));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(
            @Valid @RequestBody AuthRequest request
    ) {
        return ResponseEntity.ok(ApiResponse.success("Login successful", authService.login(request)));
    }
}
