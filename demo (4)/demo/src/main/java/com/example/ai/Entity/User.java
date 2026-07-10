package com.example.ai.Entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

@Entity
@Table(name = "users",
        uniqueConstraints = @UniqueConstraint(columnNames = "rollno"))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @NotBlank(message = "Roll number is required")
    @Size(min = 3, max = 20, message = "Roll number must be between 3 and 20 characters")
    @Column(unique = true, nullable = false, length = 20)
    private String rollno;


    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    @Column(nullable = false)
    private String password;

    @NotNull(message = "Role is required")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;


    @Column(length = 500)
    private String photoUrl;


    @PrePersist
    public void prePersist() {
        if (rollno != null) rollno = rollno.trim();
        if (photoUrl != null) photoUrl = photoUrl.trim();
    }
}
