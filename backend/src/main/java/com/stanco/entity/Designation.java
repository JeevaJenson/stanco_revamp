package com.stanco.entity;

import com.stanco.enums.Status;
import com.stanco.enums.StatusConverter;

import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "designations")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Designation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @Column(
            name = "des_id",
            nullable = false,
            unique = true
    )
    private String desId;


    @Column(
            name = "name",
            nullable = false
    )
    private String name;


    @Convert(
            converter = StatusConverter.class
    )
    @Column(
            name = "status",
            nullable = false,
            length = 2
    )
    private Status status = Status.active;


    @Column(
            name = "created_by",
            nullable = false
    )
    private String createdBy;


    @Column(
            name = "updated_by"
    )
    private String updatedBy;


    @Column(
            name = "created_at"
    )
    private LocalDateTime createdAt;


    @Column(
            name = "updated_at"
    )
    private LocalDateTime updatedAt;


    @Column(
            name = "deleted_at"
    )
    private LocalDateTime deletedAt;
}