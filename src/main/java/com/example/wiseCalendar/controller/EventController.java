package com.example.wiseCalendar.controller;

import com.example.wiseCalendar.model.Event;
import com.example.wiseCalendar.model.User;
import com.example.wiseCalendar.repository.EventRepository;
import com.example.wiseCalendar.service.EventService;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

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
    public Event createEvent(
            @RequestBody Map<String, String> data
    ) {

        String text = data.get("text");

        Long userId =
                Long.parseLong(data.get("userId"));

        return service.createEventFromText(
                text,
                userId
        );
    }

    @GetMapping("/{userId}")
    public List<Event> getUserEvents(
            @PathVariable Long userId
    ) {

        User user =
                new User();

        user.setId(userId);

        return repository.findByUser(user);
    }

    @DeleteMapping("/{id}")
    public void deleteEvent(@PathVariable Long id) {
        repository.deleteById(id);
    }
}