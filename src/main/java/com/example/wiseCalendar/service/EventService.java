package com.example.wiseCalendar.service;

import com.example.wiseCalendar.model.Event;
import com.example.wiseCalendar.model.User;
import com.example.wiseCalendar.repository.EventRepository;
import com.example.wiseCalendar.repository.UserRepository;
import org.springframework.stereotype.Service;
import java.time.Month;
import java.util.HashMap;
import java.util.Map;
import java.time.LocalDateTime;
import java.time.LocalTime;

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

    private final Map<String, Integer> months = new HashMap<>();

    {
        months.put("січня", 1);
        months.put("лютого", 2);
        months.put("березня", 3);
        months.put("квітня", 4);
        months.put("травня", 5);
        months.put("червня", 6);
        months.put("липня", 7);
        months.put("серпня", 8);
        months.put("вересня", 9);
        months.put("жовтня", 10);
        months.put("листопада", 11);
        months.put("грудня", 12);
    }

    public Event createEventFromText(String text, Long userId) {

        Event event = new Event();

        String lowerText = text.toLowerCase();

        String cleanTitle = lowerText;

        // Видалення часу типу 12:30
        cleanTitle =
                cleanTitle.replaceAll("\\b\\d{1,2}:\\d{2}\\b", "");

        // Видалення самостійної букви "о"
        cleanTitle =
                cleanTitle.replaceAll("\\sо\\s", " ");

        // Видалення дат типу 12 травня 2026 року
        cleanTitle =
                cleanTitle.replaceAll(
                        "\\d{1,2}\\s+(січня|лютого|березня|квітня|травня|червня|липня|серпня|вересня|жовтня|листопада|грудня)(\\s+\\d{4}\\s+року)?",
                        ""
                );

        // Видалення конструкцій "через n ..."
        cleanTitle =
                cleanTitle.replaceAll(
                        "через\\s+\\d+\\s+(годин|години|год|хвилин|хв|днів|дні|день|тижнів|тижні|тиждень|місяців|місяці|місяць|років|роки|рік)",
                        ""
                );

        // Видалення слів сьогодні/завтра/післязавтра
        cleanTitle =
                cleanTitle.replaceAll(
                        "\\b(сьогодні|завтра|післязавтра)\\b",
                        ""
                );

        // Прибираємо зайві пробіли
        cleanTitle =
                cleanTitle.replaceAll("\\s+", " ").trim();

        event.setTitle(cleanTitle);

        LocalDate date = LocalDate.now();

        LocalDateTime dateTime = LocalDateTime.now();

        Pattern fullDatePattern =
                Pattern.compile(
                        "(\\d{1,2})\\s+" +
                                "(січня|лютого|березня|квітня|травня|червня|липня|серпня|вересня|жовтня|листопада|грудня)" +
                                "(?:\\s+(\\d{4})\\s+року)?"
                );

        Matcher fullDateMatcher =
                fullDatePattern.matcher(lowerText);

        if(fullDateMatcher.find()) {

            int day =
                    Integer.parseInt(
                            fullDateMatcher.group(1)
                    );

            String monthName =
                    fullDateMatcher.group(2);

            int month =
                    months.get(monthName);

            int year;

            // Якщо рік вказаний

            if(fullDateMatcher.group(3) != null) {

                year =
                        Integer.parseInt(
                                fullDateMatcher.group(3)
                        );
            }

            // Якщо рік НЕ вказаний

            else {

                year =
                        LocalDate.now().getYear();
            }

            date =
                    LocalDate.of(
                            year,
                            month,
                            day
                    );
        }

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

        Pattern hoursPattern =
                Pattern.compile("через\\s+(\\d+)\\s+год");

        Matcher hoursMatcher =
                hoursPattern.matcher(lowerText);

        if(hoursMatcher.find()) {

            int hours =
                    Integer.parseInt(
                            hoursMatcher.group(1)
                    );

            dateTime =
                    LocalDateTime.now().plusHours(hours);

            date =
                    dateTime.toLocalDate();

            event.setTime(
                    dateTime.toLocalTime()
                            .withSecond(0)
                            .withNano(0)
                            .toString()
            );
        }

        Pattern minutesPattern =
                Pattern.compile("через\\s+(\\d+)\\s+хв");

        Matcher minutesMatcher =
                minutesPattern.matcher(lowerText);

        if(minutesMatcher.find()) {

            int minutes =
                    Integer.parseInt(
                            minutesMatcher.group(1)
                    );

            dateTime =
                    LocalDateTime.now().plusMinutes(minutes);

            date =
                    dateTime.toLocalDate();

            event.setTime(
                    dateTime.toLocalTime()
                            .withSecond(0)
                            .withNano(0)
                            .toString()
            );
        }

        event.setDate(
                date.format(
                        DateTimeFormatter.ofPattern("dd.MM.yyyy")
                )
        );

        // ЧАС

        if(event.getTime() == null) {

            String time = "00:00";

            String[] words = text.split(" ");

            for(String word : words) {

                if(word.matches("\\d{1,2}:\\d{2}")) {

                    time = word;

                    break;
                }
            }

            event.setTime(time);
        }

        User user =
                userRepository.findById(userId)
                        .orElse(null);

        event.setUser(user);

        return repository.save(event);
    }
}