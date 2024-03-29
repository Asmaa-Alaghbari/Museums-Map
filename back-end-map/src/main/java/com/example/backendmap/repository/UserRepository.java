package com.example.backendmap.repository;

import com.example.backendmap.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {
    User findByUsername(String username);


    User findByUsernameAndPassword(String username, String password);
}
