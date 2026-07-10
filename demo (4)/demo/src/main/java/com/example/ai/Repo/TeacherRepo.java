package com.example.ai.Repo;

import com.example.ai.Entity.Teacher;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;


public interface TeacherRepo extends JpaRepository<Teacher,Long> {
    Optional<Teacher> findByTeacherId(String teacherId);
}
