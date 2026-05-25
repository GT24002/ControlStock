package com.ues.controlstock.entity;

import jakarta.persistence.*;
import lombok.*;

// Proveedor que suministra productos al sistema
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
@Entity
@Table(name = "supplier")
public class Supplier {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "supplier_id")
    private Long supplierId;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(nullable = false, length = 100)
    private String contact;

    @Column(unique = true, nullable = false, length = 100)
    private String email;

    @Column(nullable = false, length = 50)
    private String phone;

    private String address;
}
