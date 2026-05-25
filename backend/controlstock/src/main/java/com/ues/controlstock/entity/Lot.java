package com.ues.controlstock.entity;

import java.math.BigDecimal;
import java.time.LocalDate;
import jakarta.persistence.*;
import lombok.*;

// Lote de productos con fecha de vencimiento
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
@Entity
@Table(name = "lot")
public class Lot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "lot_id")
    private Long lotId;

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    @Column(name = "lot_code", length = 50)
    private String lotCode;

    @Column(name = "expiration_date")
    private LocalDate expirationDate;

    @Column(precision = 12, scale = 2)
    private BigDecimal quantity;
}
