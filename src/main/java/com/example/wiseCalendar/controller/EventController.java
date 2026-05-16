package com.example.wiseCalendar.controller;

import com.example.wiseCalendar.model.Event;
import com.example.wiseCalendar.repository.EventRepository;
import com.example.wiseCalendar.service.EventService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/events")
@CrossOrigin("*")
public class EventController {

    private final EventRepository repository;
    private final EventService service;

    public EventController(EventRepository repository, EventService service) {
        this.repository = repository;
        this.service = service;
    }

    @PostMapping
    public Event createEvent(@RequestBody String text) {
        return service.createEventFromText(text);
    }

    @GetMapping
    public List<Event> getAllEvents() {
        return repository.findAll();
    }

    @DeleteMapping("/{id}")
    public void deleteEvent(@PathVariable Long id) {
        repository.deleteById(id);
    }
}