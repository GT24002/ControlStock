package com.ues.controlstock.entity;

import jakarta.persistence.*;
import lombok.*;

// Agrupa los productos por tipo
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
@Entity
@Table(name = "category")
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "category_id")
    private Long categoryId;

    @Column(unique = true, nullable = false, length = 100)
    private String name;

    private String description;
}
