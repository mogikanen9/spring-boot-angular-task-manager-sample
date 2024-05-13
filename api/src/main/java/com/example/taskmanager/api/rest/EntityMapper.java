package com.example.taskmanager.api.rest;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import org.springframework.security.core.Authentication;

import com.example.taskmanager.api.dto.UserProfileDTO;
import com.example.taskmanager.api.dto.UserTaskDTO;
import com.example.taskmanager.api.model.TaskPriority;
import com.example.taskmanager.api.model.TaskStatus;
import com.example.taskmanager.api.model.UserProfile;
import com.example.taskmanager.api.model.UserTask;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class EntityMapper {

	private static final DateTimeFormatter dateFmt = DateTimeFormatter.ofPattern("yyyy-MM-dd");
	private static final DateTimeFormatter dateTimeFmt = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:MM:SS");

	private EntityMapper() {
	}

	public static LocalDate fromDateString(String dateString) {
		return LocalDate.parse(dateString, dateFmt);
	}
	
	public static LocalDate fromDateTimeString(String dateTimeString) {
		return LocalDate.parse(dateTimeString, dateTimeFmt);
	}
	
	public static UserTaskDTO fromEntity(UserTask ut) {
		return new UserTaskDTO(ut.getId(), ut.getCreated().format(dateTimeFmt), ut.getDueDate().format(dateFmt),
				ut.getTitle(), ut.getDescription(), ut.getPriority().toString(), ut.getStatus().toString(),
				fromEntity(ut.getUserProfile()));
	}

	public static UserTask toEntity(UserTaskDTO dto) {
		return new UserTask(toEntity(dto.userProfile()), LocalDateTime.now(), LocalDate.parse(dto.dueDate(), dateFmt),
				dto.title(), dto.desc(), TaskPriority.valueOf(dto.priority()), TaskStatus.valueOf(dto.status()));
	}

	public static UserProfileDTO fromEntity(UserProfile up) {
		return new UserProfileDTO(up.getUsername(), up.getFirstName(), up.getLastName(), up.getEmail());
	}

	public static UserProfile toEntity(UserProfileDTO dto) {
		if (dto != null) {
			return new UserProfile(dto.username(), dto.firstName(), dto.lastName(), dto.email());
		} else {
			return null;
		}

	}

	public static UserProfile toEntity(Authentication auth) {
		var principal = (org.springframework.security.oauth2.jwt.Jwt) auth.getPrincipal();
		var claims = principal.getClaims();
		var fName = (String) claims.get("given_name");
		var lName = (String) claims.get("family_name");
		var email = (String) claims.get("email");
		log.atInfo().log("principal:fName->{}, lName->{}, eamil->{}", fName, lName, email);
		return new UserProfile(auth.getName(), fName, lName, email);
	}
}
