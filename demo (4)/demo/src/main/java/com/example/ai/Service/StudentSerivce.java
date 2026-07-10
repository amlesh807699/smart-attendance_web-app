package com.example.ai.Service;

import com.example.ai.Ai.PythonAIService;
import com.example.ai.Entity.Attendance;
import com.example.ai.Entity.Classes;
import com.example.ai.Entity.User;
import com.example.ai.Repo.AttendanceRepo;
import com.example.ai.Repo.ClassesRepo;
import com.example.ai.Repo.UserRepo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class StudentSerivce {

    private final UserRepo userRepo;
    private final PythonAIService pythonAIService;
    private final AttendanceRepo attendanceRepo;
    private final ClassesRepo classesRepo;


    public Map<String, Object> registerFace(String rollno, MultipartFile photo) {

        log.info("Received face registration request for rollNo={}", rollno);

        if (rollno == null || rollno.isBlank()) {
            log.error("Invalid roll number received");
            throw new IllegalArgumentException("Invalid roll number");
        }

        if (photo == null || photo.isEmpty()) {
            log.error("Photo is missing for rollNo={}", rollno);
            throw new IllegalArgumentException("Photo required");
        }

        log.info("Searching student with rollNo={}", rollno);

        User student = userRepo.findByRollno(rollno)
                .orElseThrow(() -> {
                    log.error("Student not found for rollNo={}", rollno);
                    return new RuntimeException("Student not found");
                });

        log.info("Student found. Calling Python AI for face registration.");

        Map<String, Object> result = pythonAIService.registerFaceSafe(student.getRollno(), photo);

        log.info("Face registration completed successfully for rollNo={}", rollno);

        return result;
    }



    public Attendance verifyFaceAndMarkAttendance(
            String rollno,
            MultipartFile photo,
            Long classId
    ) {

        log.info("Attendance verification started. rollNo={}, classId={}", rollno, classId);

        if (rollno == null || rollno.isBlank()) {
            log.error("Invalid user received");
            throw new IllegalArgumentException("Invalid user");
        }

        if (photo == null || photo.isEmpty()) {
            log.error("Photo not provided for rollNo={}", rollno);
            throw new IllegalArgumentException("Photo required");
        }

        if (classId == null) {
            log.error("Class ID is missing");
            throw new IllegalArgumentException("Class ID missing");
        }

        log.info("Fetching student from database");

        User student = userRepo.findByRollno(rollno)
                .orElseThrow(() -> {
                    log.error("Student not found for rollNo={}", rollno);
                    return new RuntimeException("Student not found");
                });

        log.info("Student found with id={}", student.getId());

        log.info("Fetching class with id={}", classId);

        Classes classes = classesRepo.findById(classId)
                .orElseThrow(() -> {
                    log.error("Class not found with id={}", classId);
                    return new RuntimeException("Class not found");
                });

        log.info("Class found: {}", classes.getName());

        log.info("Checking if attendance is already marked");

        boolean alreadyMarked =
                attendanceRepo.existsByStudentAndClasses(student, classes);

        if (alreadyMarked) {
            log.warn("Attendance already marked for rollNo={} classId={}", rollno, classId);
            throw new IllegalStateException("Attendance already marked");
        }

        Map<String, Object> aiResult;

        try {

            log.info("Calling Python AI face verification service");

            aiResult = pythonAIService.verifyFaceSafe(
                    student.getRollno(),
                    photo
            );

            log.info("Python AI verification completed");

        } catch (Exception e) {

            log.error("Python AI verification service unavailable", e);

            throw new RuntimeException("Face verification service unavailable");
        }

        Boolean match = (Boolean) aiResult.get("match");
        Double distance = ((Number) aiResult.get("distance")).doubleValue();

        log.info("AI Result -> match={}, distance={}", match, distance);

        if (match == null || !match) {
            log.warn("Face not matched for rollNo={}", rollno);
            throw new RuntimeException("Face not matched");
        }

        log.info("Creating attendance entity");

        Attendance attendance = new Attendance();
        attendance.setStudent(student);
        attendance.setClasses(classes);
        attendance.setFaceMatched(true);
        attendance.setFaceDistance(distance);
        attendance.setMarkedAt(LocalDateTime.now());

        log.info("Saving attendance to database");

        Attendance savedAttendance = attendanceRepo.save(attendance);

        log.info("Attendance saved successfully with id={}", savedAttendance.getId());

        return savedAttendance;
    }



    public List<Classes> findAll() {
        log.info("Fetching all classes");
        return classesRepo.findAll();
    }

    public Classes findById(Long id) {
        log.info("Fetching class by id={}", id);

        return classesRepo.findById(id)
                .orElseThrow(() -> {
                    log.error("Class not found with id={}", id);
                    return new RuntimeException("Class not found");
                });
    }

    public List<Classes> byname(String name){
        log.info("Searching classes by name={}", name);
        return classesRepo.findByName(name);
    }
    public Map<String, Object> getDashboard(String rollno) {

        log.info("Fetching dashboard for rollNo={}", rollno);

        User student = userRepo.findByRollno(rollno)
                .orElseThrow(() -> {
                    log.error("Student not found");
                    return new RuntimeException("Student not found");
                });

        long totalClasses = classesRepo.count();

        long attendedClasses = attendanceRepo.countByStudentAndFaceMatchedTrue(student);

        long absentClasses = Math.max(totalClasses - attendedClasses, 0);

        double attendancePercentage = 0.0;

        if (totalClasses > 0) {
            attendancePercentage = (attendedClasses * 100.0) / totalClasses;
        }

        return Map.of(
                "rollno", student.getRollno(),
                "role", student.getRole(),
                "totalClasses", totalClasses,
                "attendedClasses", attendedClasses,
                "absentClasses", absentClasses,
                "attendancePercentage", Math.round(attendancePercentage * 100.0) / 100.0
        );
    }
}