package com.ues.controlstock.entity;

import jakarta.persistence.*;
import lombok.*;

// Permiso individual que puede asignarse a un rol
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
@Entity
@Table(name = "permission")
public class Permission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "permission_id")
    private Long permissionId;

    @Column(name = "permission_name", unique = true, nullable = false, length = 50)
    private String permissionName;

    private String description;
}
