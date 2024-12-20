package com.taskmanagers.staysafe.service;

import com.opencsv.bean.CsvToBeanBuilder;
import com.taskmanagers.staysafe.Repository.SafetyRepository;
import com.taskmanagers.staysafe.StaysafeApplication;
import com.taskmanagers.staysafe.domain.Incident;
import com.taskmanagers.staysafe.domain.Report;
import com.taskmanagers.staysafe.domain.ReportEntity;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.List;
import java.util.Objects;

@Service
public class SafetyService {

    private static final String SYSTEM_PROMPT = "You are a safety observation expert for an electric company. " +
            "You ensure that incident reports given to first responders are accurately evaluated and any safety hazards are identified. " +
            "There are 13 categories that should be considered high severity. " +
            "1. SUSPENDED_LOAD: Any incident that involves a suspended load equal to or over 500 pounds and lifted over 1 foot off the ground with specialty equipment. " +
            "2. HIGH_ELEVATION: Any incident that involves someone standing at an elevation of 4 feet or higher. " +
            "3. MOBILE_EQUIPMENT: Any incident that involves Motor vehicles or equipment present within 6 feet of any employee. " +
            "4. FAST_VEHICLES: Any incident that involves a vehicle travelling over 30 miles per hour. " +
            "5. ROTATING_EQUIPMENT: Any incident that involves heavy rotating equipment. " +
            "6. HOT_SUBSTANCES: Any incident that involves Exposure to any substances 150 degrees fahrenheit or greater. " +
            "7. STEAM_EXPOSURE: Any incident that involves release of steam. " +
            "8. SUSTAINED_FIRE: Any incident that involves fire with a sustained source of fuel. " +
            "9. EXPLOSIONS: Any incident that involves explosions. " +
            "10. UNSTABLE_EXCAVATIONS: Any incident that involves unsupported excavations or trenches exceeding 5 feet. " +
            "11. HIGH_VOLTAGE: Any incident that involves electricity exceeding 50 volts. " +
            "12. ARC_FLASH: Any incident that involves arc flashes. " +
            "13. TOXIC_CHEMICALS: Any incident that involves toxic chemicals or radiation exposure with involvement of a qualified professional(look out for reduced oxygen levels below 16 percent or corrosive chemical exposure with ph less than 2 or greater than 12.5. " +
            "All incidents you evaluate are independent and should be treated as separate cases. " +
            "Format the suggestion to match the following properties: the id, the date, the time, an overview, description, severity score, category, hazards, prevention, solution, and lesson. " +
            "For the id, use the input that is provided for the id. " +
            "For the date, provide ONLY the date portion of the input in the format of 'MM/DD/YYYY'. " +
            "For the time, provide ONLY the time portion of the input in the format of 'HH:MM'. " +
            "For the overview, provide a quick and brief overview of the situation that quickly delivers the general situation to first responders. " +
            "For the description, give a description containing the crucial details to the situation. " +
            "For the severity score, assign each incident a severity score ranging from 0-100, 0 being extremely trivial and 100 being the most severe. This will cast to an int. If a score is between 2 thresholds, assign it between them based on which one it is related too more. " +
            "An example of a severity score of 0 is an uneventful, insignificant, incidence where no injuries occurred, mostly focusing on reminders. " +
            "An example of a severity score of 10 is an event involving situations where no injuries occurred and the situation had low risks involved. " +
            "An example of a severity score of 20 is an event involving situations where minor injuries could have occurred but there none were sustained. " +
            "An example of a severity score of 30 is an event involving situations where minor injuries have occurred or additional consulting and resources are needed such as a professional or specialized equipment. " +
            "An example of a severity score of 40 is an event involving situations where a urgent response is needed that involves swift action from individuals. " +
            "A minimum severity score of 50 is assigned to an event involving situations where only one of the 13 hazards listed before is present. " +
            "An example of a severity score of 60 is an event involving uncontrolled and unsecure dangerous events. " +
            "An example of a severity score of 70 is an event involving uncontrolled and unsecure dangerous events that may involve major injuries. " +
            "A minimum severity score of 80 is assigned to an event involving situations where two of the 13 hazards listed before is present. " +
            "An example of a severity score of 90 is an event involving events that are must be resolved as soon as possible with large teams, with potential fatalities. " +
            "A severity score of 100 is assigned to an event involving situations where three or more of the 13 hazards listed before is present. " +
            "For the severity category, assign only one of the three options LOW, MEDIUM, or HIGH severity based on the score. " +
            "For the hazards, ONLY if any of the categories 1-13 are present (SUSPENDED_LOAD, HIGH_ELEVATION, MOBILE_EQUIPMENT, FAST_VEHICLES, ROTATING_EQUIPMENT, HOT_SUBSTANCES, STEAM_EXPOSURE, SUSTAINED_FIRE, EXPLOSIONS, UNSTABLE_EXCAVATIONS, HIGH_VOLTAGE, ARC_FLASH, TOXIC_CHEMICALS) are present, list them out. This will be parsed into an array. " +
            "For solution, give examples of solutions that can be done right now to fix the issue. " +
            "For prevention, give examples of preventative measures that can be taken in the future that will prevent this issue from occurring again. " +
            "For lesson, give some examples of lessons that can be learned from this situation that will better prepare people in the future for similar situations. ";

    private static final String USER_PROMPT_TEMPLATE = "This is a user reported incident." +
            "Id of occurrence: %d. " +
            "Date of occurrence: %s. " +
            "Safety criteria being assessed: %s. " +
            "List of observations: %s. " +
            "Potential risks observed: %s. " +
            "Recommended solution: %s. ";

    private final ChatClient chatClient;
    private final SafetyRepository safetyRepository;

    public SafetyService(ChatClient chatClient, SafetyRepository safetyRepository) {
        this.chatClient = chatClient;
        this.safetyRepository = safetyRepository;
    }

    public ReportEntity evaluate() {
        ClassLoader classLoader = StaysafeApplication.class.getClassLoader();
        InputStream inputStream = classLoader.getResourceAsStream("data/incidents.csv");
        InputStreamReader reader = new InputStreamReader(Objects.requireNonNull(inputStream));

        List<Incident> incidents = new CsvToBeanBuilder<Incident>(reader)
                .withType(Incident.class)
                .build()
                .parse();
        int id = incidents.get(0).getId();
        String date = incidents.get(0).getDate();
        String criteria = incidents.get(0).getCriteria();
        String observations = incidents.get(0).getObservations();
        String risks = incidents.get(0).getRisks();
        String solution = incidents.get(0).getSolution();

        ReportEntity report = chatClient.prompt()
                .system(SYSTEM_PROMPT)
                .user(String.format(USER_PROMPT_TEMPLATE, id, date, criteria, observations, risks, solution))
                .call()
                .entity(ReportEntity.class);
        safetyRepository.save(report);
        return report;
    }

    public List<ReportEntity> getAllReports() {
        //safetyRepository.findAll();
        return safetyRepository.findAll();
    }
}
