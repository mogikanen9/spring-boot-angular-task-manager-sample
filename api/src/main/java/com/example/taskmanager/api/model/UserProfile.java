package com.example.taskmanager.api.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Entity
@Table(name = "USER_PROFILE")
@Getter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class UserProfile {

	@Id
	private String username;

	private String firstName;

	private String lastName;
	
	private String email;

}
