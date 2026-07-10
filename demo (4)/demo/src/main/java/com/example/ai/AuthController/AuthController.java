package com.example.ai.AuthController;

import com.example.ai.Ai.PythonAIService;
import com.example.ai.Cloudnairy.CloudService;
import com.example.ai.Entity.Role;
import com.example.ai.Entity.User;
import com.example.ai.Repo.UserRepo;
import com.example.ai.Security.JwtUtils;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepo userRepo;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;
    private final PythonAIService pythonAIService;
    private final CloudService cloudService;


    @PostMapping(value = "/register", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> register(
            @Valid @RequestPart("user") User user,
            @RequestPart("photo") MultipartFile photo
    ) {

        System.out.println("Registration Started");

        try {

            if (user.getRollno() == null || user.getRollno().isBlank()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("message", "Invalid roll number"));
            }

            if (userRepo.findByRollno(user.getRollno()).isPresent()) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body(Map.of("message", "Roll number already exists"));
            }

            if (user.getRole() == Role.ADMIN) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("message", "ADMIN registration not allowed"));
            }

            if (user.getPassword() == null || user.getPassword().length() < 8) {
                return ResponseEntity.badRequest()
                        .body(Map.of("message", "Password too weak"));
            }

            user.setPassword(passwordEncoder.encode(user.getPassword()));

            System.out.println("Uploading Image To Cloud...");
            String imageUrl = cloudService.uploadImage(photo);
            System.out.println("Cloud Upload Success: " + imageUrl);

            user.setPhotoUrl(imageUrl);

            System.out.println("Registering Face To Python AI...");
            pythonAIService.registerFaceSafe(user.getRollno(), photo);
            System.out.println("Python AI Registered");

            userRepo.save(user);
            System.out.println("User Saved In Database");

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(Map.of(
                            "message", "Registered successfully",
                            "rollno", user.getRollno()
                    ));

        } catch (Exception e) {

            System.out.println("REGISTRATION FAILED");
            e.printStackTrace();

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "message", "Registration failed",
                            "error", e.getMessage()
                    ));
        }
    }



    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody Map<String, String> body,
            HttpServletResponse response
    ) {

        System.out.println("Login Attempt Started");

        try {

            String rollno = body.get("rollno");
            String password = body.get("password");

            if (rollno == null || password == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("message", "Missing credentials"));
            }

            Optional<User> optionalUser = userRepo.findByRollno(rollno);

            if (optionalUser.isEmpty()) {
                System.out.println("User Not Found");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("message", "Invalid credentials"));
            }

            User user = optionalUser.get();

            if (!passwordEncoder.matches(password, user.getPassword())) {
                System.out.println("Wrong Password");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("message", "Invalid credentials"));
            }

            System.out.println("Password Matched");

            String token = jwtUtils.generateToken(
                    user.getRollno(),
                    user.getRole().name()
            );

            System.out.println("JWT Generated");

            Cookie cookie = new Cookie("token", token);
            cookie.setHttpOnly(true);
            cookie.setSecure(true);
            cookie.setPath("/");
            cookie.setMaxAge(24 * 60 * 60);
            cookie.setAttribute("SameSite", "Strict");

            response.addCookie(cookie);

            System.out.println("Login Successful");

            return ResponseEntity.ok(
                    Map.of("message", "Login successful")
            );

        } catch (Exception e) {

            System.out.println(" LOGIN FAILED");
            e.printStackTrace();

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "message", "Login failed",
                            "error", e.getMessage()
                    ));
        }
    }



    @GetMapping("/me")
    public ResponseEntity<?> me(HttpServletRequest request) {

        String rollno = (String) request.getAttribute("rollno");

        if (rollno == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Unauthorized"));
        }

        User user = userRepo.findByRollno(rollno)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return ResponseEntity.ok(
                Map.of(
                        "id", user.getId(),
                        "rollno", user.getRollno(),
                        "role", user.getRole().name(),
                        "photoUrl", user.getPhotoUrl()
                )
        );
    }



    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {

        System.out.println("Logout Started");

        Cookie cookie = new Cookie("token", "");
        cookie.setHttpOnly(true);
        cookie.setSecure(true); //
        cookie.setPath("/");
        cookie.setMaxAge(0);
        cookie.setAttribute("SameSite", "Strict");

        response.addCookie(cookie);

        System.out.println(" Logout Successful");

        return ResponseEntity.ok(
                Map.of("message", "Logged out successfully")
        );
    }
}