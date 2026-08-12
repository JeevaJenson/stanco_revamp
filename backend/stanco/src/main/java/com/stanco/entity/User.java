package com.stanco.entity;

import com.stanco.enums.Status;
import com.stanco.enums.StatusConverter;
import jakarta.persistence.Convert;

import jakarta.persistence.*;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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


    @Column(
            name = "empID",
            nullable = false,
            unique = true
    )
    private String empID;


    @Column(
            name = "name",
            nullable = false
    )
    private String name;


    @Column(
            name = "designation",
            nullable = false
    )
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


    @Column(
            name = "email",
            nullable = false
    )
    private String email;


    @Column(
            name = "mobile_no",
            nullable = false
    )
    private String mobileNo;


    @Column(
            name = "role_type",
            nullable = false
    )
    private String roleType;

    @Convert(
            converter = StatusConverter.class
    )
    @Column(
            name = "profile_status",
            nullable = false,
            length = 2
    )
    private Status profileStatus = Status.active;


    @Column(
            name = "password",
            nullable = false
    )
    private String password;


    @Column(name = "remember_token")
    private String rememberToken;


    @Column(name = "created_at")
    private LocalDateTime createdAt;


    @Column(name = "updated_at")
    private LocalDateTime updatedAt;


    @Column(
            name = "team",
            nullable = false
    )
    private String team;


    @Column(
            name = "color_code",
            nullable = false
    )
    private String colorCode;
}