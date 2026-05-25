package com.ues.controlstock.entity;

import jakarta.persistence.*;
import lombok.*;

// Tabla intermedia que relaciona roles con permisos (N:M)
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
@Entity
@Table(name = "role_permission")
public class RolePermission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "role_id", nullable = false)
    private Role role;

    @ManyToOne
    @JoinColumn(name = "permission_id", nullable = false)
    private Permission permission;
}
