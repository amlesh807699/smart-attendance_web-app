package com.example.ai.Repo;

import com.example.ai.Entity.Attendance;
import com.example.ai.Entity.Classes;
import com.example.ai.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AttendanceRepo extends JpaRepository<Attendance, Long> {
    List<Attendance> findByClasses(Classes classes);

    boolean existsByStudentAndClasses(User student, Classes classes);

    long countByStudentAndFaceMatchedTrue(User student);
}

