package com.example.taskmanager.api.service;

import java.util.Optional;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.taskmanager.api.dto.UserTaskDTO;
import com.example.taskmanager.api.model.TaskPriority;
import com.example.taskmanager.api.model.TaskStatus;
import com.example.taskmanager.api.model.UserProfile;
import com.example.taskmanager.api.model.UserTask;
import com.example.taskmanager.api.repo.UserProfileRepository;
import com.example.taskmanager.api.repo.UserTaskRepository;
import com.example.taskmanager.api.rest.EntityMapper;

import lombok.extern.slf4j.Slf4j;

@Service
@Transactional
@Slf4j
public class UserTaskServiceImpl implements UserTaskService {

	private UserProfileRepository userProfileRepo;
	private final UserTaskRepository userTaskRepo;

	public UserTaskServiceImpl(UserTaskRepository userTaskRepo, UserProfileRepository userProfileRepo) {
		this.userTaskRepo = userTaskRepo;
		this.userProfileRepo = userProfileRepo;
	}

	@Override
	public void deleteUserTask(Long taskId, String username) {
		Optional<UserTask> userTask = this.userTaskRepo.findById(taskId);
		if (userTask.isEmpty()) {
			log.warn("returning not found");
			throw new TaskNotFoundException("Task with id:" + taskId + " not found");
		} else {

			if (userTask.get().getUserProfile().getUsername().equalsIgnoreCase(username)) {
				this.userTaskRepo.deleteById(taskId);
			} else {
				throw new AccessDeniedException("You are not authorized to delete this task");
			}

		}
	}

	@Override
	public void updateUserTask(UserTaskDTO updatedUserTask, String username) {
		
		Optional<UserTask> userTask = this.userTaskRepo.findById(updatedUserTask.id());
		if (userTask.isEmpty()) {
			log.atWarn().log("returning not found");
			throw new TaskNotFoundException("Task with id:" + updatedUserTask.id() + " not found");
		} else {

			if (userTask.get().getUserProfile().getUsername().equalsIgnoreCase(username)) {
				UserTask entity = userTask.get();
				entity.setDescription(updatedUserTask.desc());
				entity.setTitle(updatedUserTask.title());
				entity.setDueDate(EntityMapper.fromDateString(updatedUserTask.dueDate()));
				entity.setPriority(TaskPriority.valueOf(updatedUserTask.priority().toUpperCase()));
				entity.setStatus(TaskStatus.valueOf(updatedUserTask.status().toUpperCase()));
				this.userTaskRepo.save(entity);

			} else {
				throw new AccessDeniedException("You are not authorized to delete this task");
			}

		}
		
	}
	
	@Override
	public void createUserTask(UserTaskDTO userTask, Authentication auth ) {
		log.info("userTask->%s".formatted(userTask.toString()));

		UserTask newUt = EntityMapper.toEntity(userTask);

		UserProfile up = this.userProfileRepo.findByUsername(auth.getName());
		if (up == null) {
			up = EntityMapper.toEntity(auth);
			log.atInfo().log("creaeting new UserProfile entity->{}", up);
			up = this.userProfileRepo.save(up);
		}
		log.atInfo().log("up->%s".formatted(up));
		newUt.setUserProfile(up);

		this.userTaskRepo.save(newUt);
		
	}

	
	static class TaskNotFoundException extends RuntimeException {

		private static final long serialVersionUID = 1L;

		public TaskNotFoundException(String message) {
			super(message);
		}

		public TaskNotFoundException(String message, Throwable cause) {
			super(message, cause);
		}
	}
	
}
