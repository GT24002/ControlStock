package com.ues.controlstock.entity;

import java.time.LocalDateTime;
import jakarta.persistence.*;
import lombok.*;

// Entidad que representa la tabla app_user en la base de datos
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
@Entity
@Table(name = "app_user")
public class AppUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long userId;

    // Nombre de acceso al sistema — único por usuario
    @Column(unique = true, nullable = false, length = 50)
    private String username;

    @Column(nullable = false, length = 50)
    private String name;

    @Column(nullable = false, length = 50)
    private String lastname;

    // Correo electrónico — único por usuario
    @Column(unique = true, nullable = false, length = 100)
    private String email;

    // Contraseña encriptada con BCrypt — nunca se guarda en texto plano
    @Column(name = "password_hash", nullable = false, length = 255)
    private String passwordHash;

    // true = activo, false = inactivo
    @Column(nullable = false)
    private Boolean status = true;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();
}