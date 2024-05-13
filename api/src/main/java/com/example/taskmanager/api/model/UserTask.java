package com.example.taskmanager.api.model;

import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "USER_TASK", indexes = { @Index(name = "idx_priority", columnList = "priority"),
		@Index(name = "idx_status", columnList = "status") })
@EqualsAndHashCode
@Getter
@Setter
public class UserTask {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne
	private UserProfile userProfile;

	@Column(name = "created", nullable = false)
	private LocalDateTime created;

	@Column(name = "dueDate", nullable = false)
	private LocalDate dueDate;

	@Column(name = "title", length = 50, nullable = false)
	private String title;

	@Column(name = "description", length = 255, nullable = false)
	private String description;

	@Enumerated(EnumType.STRING)
	@Column(name = "priority", nullable = false)
	private TaskPriority priority;

	@Enumerated(EnumType.STRING)
	@Column(name = "status", nullable = false)
	private TaskStatus status;

	public UserTask(UserProfile userProfile, LocalDateTime created, LocalDate dueDate, String title, String description,
			TaskPriority priority, TaskStatus status) {
		super();
		this.userProfile = userProfile;
		this.created = created;
		this.dueDate = dueDate;
		this.title = title;
		this.description = description;
		this.priority = priority;
		this.status = status;
	}

	public UserTask() {
		super();
	}

}
