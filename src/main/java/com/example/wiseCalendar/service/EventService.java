package com.example.wiseCalendar.service;

import com.example.wiseCalendar.model.Event;
import com.example.wiseCalendar.repository.EventRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@Service
public class EventService {

    private final EventRepository repository;

    public EventService(EventRepository repository) {
        this.repository = repository;
    }

    public Event createEventFromText(String text) {

        Event event = new Event();

        event.setTitle(text);

        LocalDate date = LocalDate.now();

        if(text.toLowerCase().contains("завтра")) {
            date = date.plusDays(1);
        }

        event.setDate(date.format(DateTimeFormatter.ofPattern("dd.MM.yyyy")));

        String time = "00:00";

        String[] words = text.split(" ");

        for(String word : words) {

            if(word.matches("\\d{1,2}:\\d{2}")) {
                time = word;
                break;
            }
        }

        event.setTime(time);

        return repository.save(event);
    }
}