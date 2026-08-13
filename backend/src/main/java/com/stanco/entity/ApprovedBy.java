package com.stanco.entity;

import jakarta.persistence.*;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "approved_by_tbl")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ApprovedBy {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "vertical")
    private String vertical;

    @Column(name = "name")
    private String name;

    @Column(name = "emp_id")
    private String empId;

    @Column(name = "status")
    private String status;
}