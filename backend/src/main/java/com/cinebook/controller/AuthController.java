package com.cinebook.controller;

import com.cinebook.dto.AuthResponse;
import com.cinebook.dto.LoginRequest;
import com.cinebook.dto.RegisterAdminRequest;
import com.cinebook.dto.RegisterRequest;
import com.cinebook.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public AuthResponse register(@Valid @RequestBody RegisterRequest request) {
        return authService.register(request);
    }

    @PostMapping("/register-admin")
    public AuthResponse registerAdmin(@Valid @RequestBody RegisterAdminRequest request) {
        return authService.registerAdmin(request);
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request);
    }
}
