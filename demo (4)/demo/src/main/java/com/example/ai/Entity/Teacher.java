package com.example.ai.Entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Entity
@Table(name = "teachers",
        uniqueConstraints = @UniqueConstraint(columnNames = "teacherId"))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Teacher {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @Column(nullable = false, unique = true, length = 50)
    @NotBlank(message = "Teacher ID is required")
    @Size(max = 50, message = "Teacher ID must be at most 50 characters")
    private String teacherId;


    @Column(nullable = false, length = 100)
    @NotBlank(message = "Teacher name is required")
    @Size(max = 100, message = "Teacher name must be at most 100 characters")
    private String name;


    @PrePersist
    public void prePersist() {
        if (name != null) {
            name = name.trim();
        }
        if (teacherId != null) {
            teacherId = teacherId.trim();
        }
    }
}
