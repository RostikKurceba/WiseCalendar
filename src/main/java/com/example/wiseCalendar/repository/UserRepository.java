package com.example.wiseCalendar.repository;

import com.example.wiseCalendar.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository
        extends JpaRepository<User, Long> {

    User findByEmail(String email);
}