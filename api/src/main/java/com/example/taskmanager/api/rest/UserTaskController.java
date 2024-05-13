package com.example.taskmanager.api.rest;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.taskmanager.api.dto.UserProfileDTO;
import com.example.taskmanager.api.dto.UserTaskDTO;
import com.example.taskmanager.api.model.TaskPriority;
import com.example.taskmanager.api.model.TaskStatus;
import com.example.taskmanager.api.model.UserProfile;
import com.example.taskmanager.api.model.UserTask;
import com.example.taskmanager.api.repo.UserProfileRepository;
import com.example.taskmanager.api.repo.UserTaskRepository;
import com.example.taskmanager.api.service.TaskNotFoundException;
import com.example.taskmanager.api.service.UserTaskService;

import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api")
@Slf4j
public class UserTaskController {

	private UserProfileRepository userProfileRepo;
	private final UserTaskRepository userTaskRepo;
	private final UserTaskService userTaskService;

	public UserTaskController(UserProfileRepository userProfileRepo, UserTaskRepository userTaskRepo,
			UserTaskService userTaskService) {
		super();
		this.userProfileRepo = userProfileRepo;
		this.userTaskRepo = userTaskRepo;
		this.userTaskService = userTaskService;
	}

	@GetMapping("/profile/{username}")
	public ResponseEntity<UserProfileDTO> loadProfile(@PathVariable(name = "username", required = true) String username,
			Authentication auth) {

		Optional<UserProfile> up = this.findUser(auth);

		if (up.isEmpty()) {
			log.atInfo().log("returning not found");
			return ResponseEntity.notFound().build();
		} else {

			UserProfile profile = up.get();

			// username param matches security
			if (profile.getUsername().equalsIgnoreCase(username)) {
				return ResponseEntity.ok(EntityMapper.fromEntity(profile));
			} else {
				throw new AccessDeniedException(up.toString());
			}

		}

	}

	@PreAuthorize("hasAuthority('SCOPE_access_to_task_api')")
	@GetMapping("/task")
	public List<UserTaskDTO> getTasks(
			@RequestParam(defaultValue = "", name = "statusFilter", required = false) String statusFilter,
			@RequestParam(defaultValue = "date", name = "sortBy", required = false) String sortBy,
			@RequestParam(defaultValue = "asc", name = "sortOrder", required = false) String sortOrder,
			Authentication auth) {

		log.atInfo().log("authentication->" + auth.getName());
		log.atInfo().log("authentication->" + auth.toString());

		Optional<UserProfile> up = this.findUser(auth);

		List<UserTaskDTO> rs = new ArrayList<>();

		if (up.isPresent()) {

			// filter
			if (statusFilter != null && !statusFilter.isBlank()) {
				rs = this.userTaskRepo
						.findByUserProfileUsernameAndStatus(up.get().getUsername(), TaskStatus.valueOf(statusFilter))
						.stream().map(EntityMapper::fromEntity).collect(Collectors.toList());
			} else {
				rs = this.userTaskRepo.findByUserProfileUsername(up.get().getUsername()).stream()
						.map(EntityMapper::fromEntity).collect(Collectors.toList());
			}

			// sort
			if (sortBy != null && !sortBy.isBlank() && sortOrder != null && !sortOrder.isBlank()) {

				if (sortBy.equalsIgnoreCase("priority")) {
					rs.sort(new UserTaskPriorityComparator());
				} else {
					rs.sort(Comparator.comparing(UserTaskDTO::dueDate));
				}
			}

		} else {
			log.atWarn().log("No user found");
		}
		return rs;

	}

	@PreAuthorize("hasAuthority('SCOPE_access_to_task_api')")
	@GetMapping("/task/{taskId}")
	public ResponseEntity<UserTaskDTO> loadUserTask(@PathVariable(name = "taskId", required = true) Long taskId,
			Authentication auth) {

		Optional<UserTask> userTask = this.userTaskRepo.findById(taskId);
		if (userTask.isEmpty()) {
			log.info("returning not found");
			return ResponseEntity.notFound().build();
		}

		if (!userTask.get().getUserProfile().getUsername().equals(auth.getName())) {
			log.warn("hacker or bug");
			return ResponseEntity.notFound().build();
		} else {
			return ResponseEntity.ok(EntityMapper.fromEntity(userTask.get()));
		}

	}

	@PreAuthorize("hasAuthority('SCOPE_access_to_task_api')")
	@DeleteMapping("/task/{taskId}")
	public ResponseEntity<Void> deleteUserTask(@PathVariable(name = "taskId", required = true) Long taskId,
			Authentication auth) {
		try {
			this.userTaskService.deleteUserTask(taskId, auth.getName());
			return ResponseEntity.accepted().build();

		} catch (TaskNotFoundException ex) {
			log.warn("hacker or bug");
			return ResponseEntity.notFound().build();
		} catch (AccessDeniedException ad) {
			return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
		}

	}

	@PreAuthorize("hasAuthority('SCOPE_access_to_task_api')")
	@PostMapping("/task")
	public ResponseEntity<Void> createUserTask(@RequestBody UserTaskDTO userTask, Authentication auth) {

		log.info("userTask->%s".formatted(userTask.toString()));
		this.userTaskService.createUserTask(userTask, auth);
		return ResponseEntity.status(HttpStatus.CREATED).build();

	}

	@PreAuthorize("hasAuthority('SCOPE_access_to_task_api')")
	@PutMapping("/task")
	public ResponseEntity<Void> updateUserTask(@RequestBody UserTaskDTO userTask, Authentication auth) {

		log.atInfo().log("userTask->%s".formatted(userTask.toString()));

		try {
			this.userTaskService.updateUserTask(userTask, auth.getName());
			return ResponseEntity.ok().<Void>build();
		} catch (TaskNotFoundException e) {
			log.atError().log(e.getMessage(), e);
			return ResponseEntity.notFound().build();
		}

	}

	@PreAuthorize("hasAuthority('SCOPE_access_to_task_api')")
	@PatchMapping("/task/complete/{taskId}")
	public ResponseEntity<Void> completeUserTask(@PathVariable(name = "taskId", required = true) Long taskId,
			Authentication auth) {

		log.info("completeUserTask:taskId->%s".formatted(taskId));

		return this.userTaskRepo.findById(taskId).map((entity) -> {

			if (!entity.getUserProfile().getUsername().equals(auth.getName())) {
				throw new AccessDeniedException("Don't hack me in complete");
			} else {
				entity.setStatus(TaskStatus.COMPLETE);

				this.userTaskRepo.save(entity);

				return ResponseEntity.ok().<Void>build();
			}

		}).orElse(ResponseEntity.notFound().build());
	}

	protected Optional<UserProfile> findUser(Authentication authentication) {

		String username = null;// "john.doe";

		if (authentication != null) {
			username = authentication.getName();
		}

		log.atInfo().log("username->%s".formatted(username));

		UserProfile up = this.userProfileRepo.findByUsername(username);

		return Optional.ofNullable(up);

	}

	static class UserTaskPriorityComparator implements Comparator<UserTaskDTO> {

		@Override
		public int compare(UserTaskDTO o1, UserTaskDTO o2) {
			if (o1.priority().equals(o2.priority())) {
				return 0;
			} else if (o1.priority().equals(TaskPriority.HIGH.toString())
					&& (o2.priority().equals(TaskPriority.LOW.toString())
							|| o2.priority().equals(TaskPriority.MEDIUM.toString()))) {
				return 1;
			} else {
				return -1;
			}
		}

	}

}
