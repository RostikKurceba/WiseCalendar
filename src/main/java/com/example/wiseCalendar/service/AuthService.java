package com.example.wiseCalendar.service;

import com.example.wiseCalendar.model.User;
import com.example.wiseCalendar.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository repository;

    public AuthService(UserRepository repository) {
        this.repository = repository;
    }

    public String register(
            String email,
            String password,
            String confirmPassword
    ) {

        if(!email.contains("@") ||
                !email.contains(".")) {

            return "Неправильний email";
        }

        if(password.length() < 6) {

            return
                    "Пароль має містити більше 6 символів";
        }

        if(!password.equals(confirmPassword)) {

            return "Паролі не співпадають";
        }

        if(repository.findByEmail(email) != null) {

            return "Користувач вже існує";
        }

        User user =
                new User(email, password);

        repository.save(user);

        return "SUCCESS";
    }

    public User login(
            String email,
            String password
    ) {

        User user =
                repository.findByEmail(email);

        if(user == null) {
            return null;
        }

        if(!user.getPassword().equals(password)) {
            return null;
        }

        return user;
    }
}