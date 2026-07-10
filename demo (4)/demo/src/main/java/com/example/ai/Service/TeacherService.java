package com.example.ai.Service;

import com.example.ai.Entity.*;
import com.example.ai.Repo.AttendanceRepo;
import com.example.ai.Repo.ClassesRepo;
import com.example.ai.Repo.TeacherRepo;
import com.example.ai.Repo.UserRepo;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class TeacherService {

    private final UserRepo userRepo;
    private final AttendanceRepo attendanceRepo;
    private final ClassesRepo classesRepo;
    private final TeacherRepo teacherRepo;


    public Classes createClass(String rollno, Classes classes) {

        log.info("Create class request received. Teacher RollNo={}", rollno);

        if (rollno == null || rollno.isBlank()) {
            log.error("Teacher roll number is missing");
            throw new IllegalArgumentException("Teacher roll number is required");
        }

        if (classes == null) {
            log.error("Class object is null");
            throw new IllegalArgumentException("Class data cannot be null");
        }

        log.info("Fetching teacher with rollNo={}", rollno);

        User teacher = userRepo.findByRollno(rollno)
                .orElseThrow(() -> {
                    log.error("Teacher not found. RollNo={}", rollno);
                    return new RuntimeException("Teacher not found");
                });

        log.info("Teacher found with id={}", teacher.getId());

        if (teacher.getRole() != Role.TEACHER) {
            log.warn("User is not a teacher. RollNo={}", rollno);
            throw new RuntimeException("Only teachers can create classes");
        }

        log.info("Preparing class entity for saving");

        classes.setId(null);
        classes.setTeacher(teacher);

        Classes savedClass = classesRepo.save(classes);

        log.info("Class created successfully. ClassId={}", savedClass.getId());

        return savedClass;
    }


    public Classes findById(Long id) {

        log.info("Fetching class by id={}", id);

        if (id == null || id <= 0) {
            log.error("Invalid class ID={}", id);
            throw new IllegalArgumentException("Invalid class ID");
        }

        Classes classes = classesRepo.findById(id)
                .orElseThrow(() -> {
                    log.error("Class not found. id={}", id);
                    return new RuntimeException("Class not found");
                });

        log.info("Class found. id={}, name={}", classes.getId(), classes.getName());

        return classes;
    }


    public void deleteClass(Long id) {

        log.info("Delete class request received. id={}", id);

        if (id == null || id <= 0) {
            log.error("Invalid class ID={}", id);
            throw new IllegalArgumentException("Invalid class ID");
        }

        if (!classesRepo.existsById(id)) {
            log.error("Class does not exist. id={}", id);
            throw new RuntimeException("Class does not exist");
        }

        log.info("Deleting class with id={}", id);

        classesRepo.deleteById(id);

        log.info("Class deleted successfully. id={}", id);
    }


    public List<Classes> getClass(String rollno) {

        log.info("Fetching classes for teacher. RollNo={}", rollno);

        if (rollno == null || rollno.isBlank()) {
            log.error("Teacher roll number is missing");
            throw new IllegalArgumentException("Roll number required");
        }

        if (!userRepo.existsByRollno(rollno)) {
            log.error("Teacher not found. RollNo={}", rollno);
            throw new RuntimeException("Teacher not found");
        }

        List<Classes> classes = classesRepo.findByTeacher_Rollno(rollno);

        log.info("Found {} classes for teacher RollNo={}", classes.size(), rollno);

        return classes;
    }


    public List<User> getStudentsWhoJoinedClass(Long id) {

        log.info("Fetching students who joined class. ClassId={}", id);

        if (id == null || id <= 0) {
            log.error("Invalid class ID={}", id);
            throw new IllegalArgumentException("Invalid class ID");
        }

        Classes classes = classesRepo.findById(id)
                .orElseThrow(() -> {
                    log.error("Class not found. id={}", id);
                    return new RuntimeException("Class not found");
                });

        log.info("Class found. Fetching attendance records.");

        List<Attendance> attendanceList =
                attendanceRepo.findByClasses(classes);

        log.info("Attendance records found={}", attendanceList.size());

        List<User> students = attendanceList.stream()
                .map(Attendance::getStudent)
                .filter(student -> student != null)
                .distinct()
                .toList();

        log.info("Total unique students joined class={}", students.size());

        return students;
    }
    public Map<String, Object> getDashboard(String rollno) {

        log.info("Dashboard request received for rollno={}", rollno);

        User user = userRepo.findByRollno(rollno)
                .orElseThrow(() -> new RuntimeException("User not found"));

        log.info("User found: rollno={}, role={}", user.getRollno(), user.getRole());

        if (user.getRole() != Role.TEACHER) {
            throw new RuntimeException("Not a teacher");
        }

        long totalClasses = classesRepo.countByTeacher(user);

        long ongoingClasses = classesRepo.countByTeacherAndStatus(
                user,
                ClassStatus.ONGOING
        );

        long finishedClasses = classesRepo.countByTeacherAndStatus(
                user,
                ClassStatus.FINISHED
        );

        log.info("Stats -> total={}, ongoing={}, finished={}",
                totalClasses, ongoingClasses, finishedClasses);

        return Map.of(
                "teacherId", user.getRollno(),
                "name", user.getRollno(),
                "totalClasses", totalClasses,
                "ongoingClasses", ongoingClasses,
                "finishedClasses", finishedClasses
        );
    }

}