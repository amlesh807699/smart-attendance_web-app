package com.example.ai.Repo;

import com.example.ai.Entity.Classes;
import com.example.ai.Entity.User;
import com.example.ai.Entity.ClassStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ClassesRepo extends JpaRepository<Classes, Long> {

    List<Classes> findByTeacher_Rollno(String rollno);

    List<Classes> findByName(String name);

    long countByTeacher(User teacher);

    long countByTeacherAndStatus(User teacher, ClassStatus status);
}