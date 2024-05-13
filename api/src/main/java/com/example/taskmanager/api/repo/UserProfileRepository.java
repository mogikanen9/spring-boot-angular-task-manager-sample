package com.example.taskmanager.api.repo;

import java.util.List;

import org.springframework.data.repository.CrudRepository;

import com.example.taskmanager.api.model.UserProfile;

public interface UserProfileRepository extends CrudRepository<UserProfile, String> {

	List<UserProfile> findByLastName(String lastName);

	UserProfile findByUsername(String username);
}
