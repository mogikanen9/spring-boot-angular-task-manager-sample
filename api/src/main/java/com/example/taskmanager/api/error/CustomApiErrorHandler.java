package com.example.taskmanager.api.error;

import java.time.LocalDateTime;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@ControllerAdvice
public class CustomApiErrorHandler extends ResponseEntityExceptionHandler {

	@ExceptionHandler(Exception.class)
	public ResponseEntity<ErrorResponse> handleException(Exception ex) {

		if(ex.getMessage().contains("Access denied") || ex instanceof AccessDeniedException) {
			return new ResponseEntity<>(new ErrorResponse(HttpStatus.FORBIDDEN.value(), 
					"Access is denied",
					"You are not authorized to make that request", LocalDateTime.now()),
					HttpStatus.FORBIDDEN);
		}
		
		return new ResponseEntity<>(new ErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR.value(), 
				"Internal Server Error",
				"An unexpected error occurred", LocalDateTime.now()), HttpStatus.INTERNAL_SERVER_ERROR);
	}
}

record ErrorResponse(int status, String error, String message, LocalDateTime timestamp) {
}
