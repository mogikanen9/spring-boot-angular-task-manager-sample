package com.example.taskmanager.api.dto;

public record UserTaskDTO(Long id, String created, String dueDate, String title, String desc, String priority,
		String status, UserProfileDTO userProfile) {
}
