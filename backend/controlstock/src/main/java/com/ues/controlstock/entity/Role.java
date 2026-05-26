package com.ues.controlstock.entity;

import jakarta.persistence.*;
import lombok.*;

// Rol del sistema que agrupa permisos y se asigna a usuarios
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
@Entity
@Table(name = "role")
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "role_id")
    private Long roleId;

    @Column(name = "role_name", unique = true, nullable = false, length = 50)
    private String roleName;

    private String description;
}