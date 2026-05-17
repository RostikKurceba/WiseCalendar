package com.example.wiseCalendar.controller;

import com.example.wiseCalendar.model.User;
import com.example.wiseCalendar.service.AuthService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@CrossOrigin("*")
public class AuthController {

    private final AuthService service;

    public AuthController(AuthService service) {
        this.service = service;
    }

    @PostMapping("/register")
    public String register(
            @RequestBody Map<String, String> data
    ) {

        return service.register(
                data.get("email"),
                data.get("password"),
                data.get("confirmPassword")
        );
    }

    @PostMapping("/login")
    public User login(
            @RequestBody Map<String, String> data
    ) {

        return service.login(
                data.get("email"),
                data.get("password")
        );
    }
}