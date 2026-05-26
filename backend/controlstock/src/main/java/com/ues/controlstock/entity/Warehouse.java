package com.ues.controlstock.entity;

import jakarta.persistence.*;
import lombok.*;

// Almacén físico donde se guarda el stock
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
@Entity
@Table(name = "warehouse")
public class Warehouse {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "warehouse_id")
    private Long warehouseId;

    @Column(nullable = false, length = 100)
    private String name;

    private String location;

    @Column(nullable = false, length = 50)
    private String phone1;

    @Column(length = 50)
    private String phone2;
}
