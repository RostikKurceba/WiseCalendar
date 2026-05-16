package com.example.wiseCalendar.repository;

import com.example.wiseCalendar.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EventRepository extends JpaRepository<Event, Long> {
}