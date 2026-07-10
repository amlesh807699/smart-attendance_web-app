package com.example.ai.Repo;

import com.example.ai.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepo extends JpaRepository<User,Long> {
    Optional<User> findByRollno(String rollno);

    boolean existsByRollno(String rollno);
}
