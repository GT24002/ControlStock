package com.ues.controlstock.entity;

import jakarta.persistence.*;
import lombok.*;

// Tabla intermedia que relaciona usuarios con sus roles (N:M)
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
@Entity
@Table(name = "app_user_role")
public class AppUserRole {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "app_user_id", nullable = false)
    private AppUser appUser;

    @ManyToOne
    @JoinColumn(name = "role_id", nullable = false)
    private Role role;
}