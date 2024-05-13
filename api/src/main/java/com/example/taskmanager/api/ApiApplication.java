package com.example.taskmanager.api;

import java.time.LocalDate;
import java.time.LocalDateTime;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import com.example.taskmanager.api.model.TaskPriority;
import com.example.taskmanager.api.model.TaskStatus;
import com.example.taskmanager.api.model.UserProfile;
import com.example.taskmanager.api.model.UserTask;
import com.example.taskmanager.api.repo.UserProfileRepository;
import com.example.taskmanager.api.repo.UserTaskRepository;

@SpringBootApplication
public class ApiApplication {

	public static void main(String[] args) {
		SpringApplication.run(ApiApplication.class, args);
	}

	@Bean
	CommandLineRunner demo(UserProfileRepository upRepo, UserTaskRepository utRepo) {
		return args -> {
			UserProfile demoUser = upRepo
					.save(new UserProfile("6aa2eeb8-5fa9-44b3-b14a-c36a22fad9a8", "John", "Doe", "myuser1@gmail.com"));

			utRepo.save(new UserTask(demoUser, LocalDateTime.now(), LocalDate.of(2025, 01, 01), "Test task1", "Desc1",
					TaskPriority.MEDIUM, TaskStatus.CREATED));

		};
	}
}
