package com.ues.controlstock.entity;

import jakarta.persistence.*;
import lombok.*;

// Presentación comercial de un producto (caja, paquete, unidad, etc.)
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
@Entity
@Table(name = "presentation")
public class Presentation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "presentation_id")
    private Long presentationId;

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(name = "conversion_factor")
    private Integer conversionFactor = 1;

    @Column(name = "base_unit", nullable = false, length = 50)
    private String baseUnit;

    @Column(unique = true, length = 50)
    private String barcode;
}
