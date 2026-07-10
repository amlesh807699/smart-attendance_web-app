package com.example.ai.Entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

@Entity
@Table(name = "students")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false, unique = true)
    @NotNull(message = "User is required")
    private User user;


    @Column(nullable = false)
    @NotBlank(message = "Course is required")
    private String course;

    @Column(nullable = false)
    @Min(value = 1, message = "Year must be at least 1")
    @Max(value = 10, message = "Year must not exceed 10")
    private Integer year;


    @Column(length = 500)
    private String photoUrl;


    @PrePersist
    public void prePersist() {
        if (year == null) {
            year = 1;
        }
    }
}
