package com.example.wiseCalendar.service;

import com.example.wiseCalendar.model.Event;
import com.example.wiseCalendar.model.User;
import com.example.wiseCalendar.repository.EventRepository;
import com.example.wiseCalendar.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class EventService {

    private final EventRepository repository;
    private final UserRepository userRepository;

    public EventService(
            EventRepository repository,
            UserRepository userRepository
    ) {

        this.repository = repository;
        this.userRepository = userRepository;
    }

    public Event createEventFromText(String text, Long userId) {

        Event event = new Event();

        event.setTitle(text);

        String lowerText = text.toLowerCase();

        LocalDate date = LocalDate.now();

        // СЬОГОДНІ

        if(lowerText.contains("сьогодні")) {

            date = LocalDate.now();
        }

        // ЗАВТРА

        else if(lowerText.contains("завтра") && !lowerText.contains("післязавтра")) {
            // Перевірка !contains("післязавтра") потрібна, щоб слово "завтра" всередині "післязавтра" не перехоплювало логіку
            date = LocalDate.now().plusDays(1);
        }

        // ПІСЛЯЗАВТРА = ЧЕРЕЗ 1 ДЕНЬ

        else if(lowerText.contains("післязавтра")) {

            date = LocalDate.now().plusDays(2);
        }

        // ЧЕРЕЗ ТИЖДЕНЬ

        else if(lowerText.contains("через тиждень")) {

            date = LocalDate.now().plusWeeks(1);
        }

        // ЧЕРЕЗ МІСЯЦЬ

        else if(lowerText.contains("через місяць")) {

            date = LocalDate.now().plusMonths(1);
        }

        // ЧЕРЕЗ РІК

        else if(lowerText.contains("через рік")) {

            date = LocalDate.now().plusYears(1);
        }

        // ЧЕРЕЗ N ДНІВ

        Pattern daysPattern =
                Pattern.compile("через\\s+(\\d+)\\s+д");

        Matcher daysMatcher =
                daysPattern.matcher(lowerText);

        if(daysMatcher.find()) {

            int days =
                    Integer.parseInt(daysMatcher.group(1));

            // EXCEPTION:
            // через 0 днів = сьогодні

            if(days == 0) {

                date = LocalDate.now();
            }

            // через 1 день = післязавтра

            else if(days == 1) {

                date = LocalDate.now().plusDays(2);
            }

            // стандартна логіка

            else {

                date = LocalDate.now().plusDays(days + 1);
            }
        }

        // ЧЕРЕЗ N ТИЖНІВ

        Pattern weeksPattern =
                Pattern.compile("через\\s+(\\d+)\\s+тиж");

        Matcher weeksMatcher =
                weeksPattern.matcher(lowerText);

        if(weeksMatcher.find()) {

            int weeks =
                    Integer.parseInt(weeksMatcher.group(1));

            date = LocalDate.now().plusWeeks(weeks);
        }

        // ЧЕРЕЗ N МІСЯЦІВ

        Pattern monthsPattern =
                Pattern.compile("через\\s+(\\d+)\\s+міс");

        Matcher monthsMatcher =
                monthsPattern.matcher(lowerText);

        if(monthsMatcher.find()) {

            int months =
                    Integer.parseInt(monthsMatcher.group(1));

            date = LocalDate.now().plusMonths(months);
        }

        // ЧЕРЕЗ N РОКІВ

        Pattern yearsPattern =
                Pattern.compile("через\\s+(\\d+)\\s+р");

        Matcher yearsMatcher =
                yearsPattern.matcher(lowerText);

        if(yearsMatcher.find()) {

            int years =
                    Integer.parseInt(yearsMatcher.group(1));

            date = LocalDate.now().plusYears(years);
        }

        event.setDate(
                date.format(
                        DateTimeFormatter.ofPattern("dd.MM.yyyy")
                )
        );

        // ЧАС

        String time = "00:00";

        String[] words = text.split(" ");

        for(String word : words) {

            if(word.matches("\\d{1,2}:\\d{2}")) {

                time = word;

                break;
            }
        }

        event.setTime(time);

        User user =
                userRepository.findById(userId)
                        .orElse(null);

        event.setUser(user);

        return repository.save(event);
    }
}