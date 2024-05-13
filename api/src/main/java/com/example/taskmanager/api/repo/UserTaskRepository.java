package com.example.taskmanager.api.repo;

import java.util.List;

import org.springframework.data.repository.CrudRepository;

import com.example.taskmanager.api.model.TaskStatus;
import com.example.taskmanager.api.model.UserTask;

public interface UserTaskRepository extends CrudRepository<UserTask, Long> {

	List<UserTask> findByUserProfileUsername(String username);
	
	List<UserTask> findByUserProfileUsernameAndStatus(String username, TaskStatus status);
	
}
