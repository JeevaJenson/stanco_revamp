package com.stanco.entity;

import jakarta.persistence.*;

import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "empID", nullable = false)
    private String empID;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String designation;

    @Column(name = "business")
    private String business;

    @Column(name = "department")
    private String department;

    @Column(
        name = "lob_division",
        columnDefinition = "LONGTEXT"
    )
    private String lobDivision;

    @Column(name = "supervisor")
    private String supervisor;

    @Column(nullable = false)
    private String email;

    @Column(name = "mobile_no", nullable = false)
    private String mobileNo;

    @Column(name = "role_type", nullable = false)
    private String roleType;

    @Column(name = "profile_status", nullable = false)
    private String profileStatus;

    @Column(nullable = false)
    private String password;

    @Column(name = "remember_token")
    private String rememberToken;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(nullable = false)
    private String team;

    @Column(name = "color_code", nullable = false)
    private String colorCode;
}