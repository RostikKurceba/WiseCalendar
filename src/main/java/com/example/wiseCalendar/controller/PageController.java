package com.example.wiseCalendar.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class PageController {

    @GetMapping("/")
    public String openLoginPage() {

        return "forward:/login.html";
    }
}