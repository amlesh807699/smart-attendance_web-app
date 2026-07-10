package com.example.ai.AuthController;

import com.example.ai.Entity.Attendance;
import com.example.ai.Entity.Classes;
import com.example.ai.Entity.User;
import com.example.ai.Service.TeacherService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/teacher")
public class TeaherController {
    @Autowired
    private TeacherService userService;

    @PostMapping("/create/class")
    public ResponseEntity<?> createClasses(
            HttpServletRequest request,
            @RequestBody Classes classes) {

        String rollno = (String) request.getAttribute("rollno");

        if (rollno == null) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("User not logged in");
        }

        Classes createdClass = userService.createClass(rollno, classes);
        return ResponseEntity.ok(createdClass);
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteClasses(@PathVariable Long id) {
        userService.deleteClass(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/all/class")
    public ResponseEntity<List<Classes>> findAllbyteahcer(HttpServletRequest request) {
        String rollno = (String) request.getAttribute("rollno");
        if (rollno == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok(userService.getClass(rollno));
    }

    @GetMapping("/{id}")
    ResponseEntity<Classes> findClassById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.findById(id));
    }
    @GetMapping("/attendance/class/{id}")
    public ResponseEntity<List<User>> getStudentsByClass(
            @PathVariable Long id,
            HttpServletRequest request) {

        String rollno = (String) request.getAttribute("rollno");
        if (rollno == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        return ResponseEntity.ok(userService.getStudentsWhoJoinedClass(id));
    }

    @GetMapping("/dashboard")
    public ResponseEntity<?> getDashboard(HttpServletRequest request) {

        String rollno = (String) request.getAttribute("rollno");

        if (rollno == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Teacher not logged in"));
        }

        try {
            return ResponseEntity.ok(
                    userService.getDashboard(rollno)
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", e.getMessage()));
        }
    }
}
