package com.ues.controlstock.entity;

import java.time.LocalDateTime;
import jakarta.persistence.*;
import lombok.*;

// Registra todas las acciones importantes realizadas en el sistema para auditoría
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
@Entity
@Table(name = "action_log")
public class ActionLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "action_id")
    private Long actionId;

    // Usuario que realizó la acción
    @ManyToOne
    @JoinColumn(name = "app_user_id")
    private AppUser appUser;

    @Column(nullable = false)
    private LocalDateTime date = LocalDateTime.now();

    // Descripción de la acción realizada
    private String description;

    // Tabla afectada por la acción
    @Column(name = "affected_table", length = 100)
    private String affectedTable;

    // ID del registro afectado
    @Column(name = "record_id")
    private Integer recordId;
}