package com.example.taskmanager.api.service;

import org.springframework.security.core.Authentication;

import com.example.taskmanager.api.dto.UserTaskDTO;

public interface UserTaskService {

	void deleteUserTask(Long deleteUserTask, String username);

	void updateUserTask(UserTaskDTO updatedUserTask, String username);

	void createUserTask(UserTaskDTO userTask, Authentication auth);
}
