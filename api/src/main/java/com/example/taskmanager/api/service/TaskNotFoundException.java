package com.example.taskmanager.api.service;

public class TaskNotFoundException extends RuntimeException {

	private static final long serialVersionUID = 1L;

	public TaskNotFoundException(String message) {
		super(message);
	}

	public TaskNotFoundException(String message, Throwable cause) {
		super(message, cause);
	}
}