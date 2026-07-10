package com.example.ai.AuthController;

import com.example.ai.Entity.Attendance;
import com.example.ai.Entity.Classes;
import com.example.ai.Service.StudentSerivce;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/student")
@RequiredArgsConstructor
public class StudentController {

    private final StudentSerivce studentService;


    @PostMapping("/register-face")
    public ResponseEntity<?> registerFace(
            @RequestParam("photo") MultipartFile photo,
            HttpServletRequest request
    ) {

        String rollno = (String) request.getAttribute("rollno");

        if (rollno == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "User not logged in"));
        }

        try {

            Map<String, Object> result =
                    studentService.registerFace(rollno, photo);

            return ResponseEntity.ok(result);

        } catch (Exception e) {

            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", e.getMessage()));
        }
    }


    @PostMapping("/verify-face")
    public ResponseEntity<?> verifyFace(
            @RequestParam("photo") MultipartFile photo,
            @RequestParam("classId") Long classId,
            HttpServletRequest request
    ) {

        String rollno = (String) request.getAttribute("rollno");

        if (rollno == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "User not logged in"));
        }

        try {

            Attendance attendance =
                    studentService.verifyFaceAndMarkAttendance(
                            rollno, photo, classId
                    );

            Map<String, Object> response = new HashMap<>();

            response.put("success", true);
            response.put("message", "Face verified. Attendance marked");
            response.put("distance", attendance.getFaceDistance());
            response.put("time", attendance.getMarkedAt());
            response.put("meetingUrl",
                    attendance.getClasses().getMeetingUrl());

            return ResponseEntity.ok(response);

        } catch (Exception e) {

            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of(
                            "success", false,
                            "message", e.getMessage()
                    ));
        }
    }



    @GetMapping("/all/class")
    public ResponseEntity<List<Classes>> findAll() {
        return ResponseEntity.ok(studentService.findAll());
    }



    @GetMapping("/{id}")
    public ResponseEntity<?> findById(@PathVariable Long id) {

        try {

            Classes classes = studentService.findById(id);
            return ResponseEntity.ok(classes);

        } catch (Exception e) {

            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", e.getMessage()));
        }
    }
    @GetMapping("/serach")
    ResponseEntity<List<Classes>> getbyname(@RequestParam String name){
        if(name.isEmpty()){
            System.out.print("not found");
        }
        return ResponseEntity.ok(studentService.byname(name));
    }

    @GetMapping("/dashboard")
    public ResponseEntity<?> dashboard(HttpServletRequest request) {

        String rollno = (String) request.getAttribute("rollno");

        if (rollno == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "User not logged in"));
        }

        try {

            return ResponseEntity.ok(
                    studentService.getDashboard(rollno)
            );

        } catch (Exception e) {

            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of(
                            "message", e.getMessage()
                    ));
        }
    }


}