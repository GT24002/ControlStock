package com.ues.controlstock.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import jakarta.persistence.*;
import lombok.*;

// Registro de entradas, salidas y transferencias de stock
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
@Entity
@Table(name = "movement")
public class Movement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "movement_id")
    private Long movementId;

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    @ManyToOne
    @JoinColumn(name = "warehouse_id")
    private Warehouse warehouse;

    @Column(nullable = false, length = 20)
    private String type;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal quantity;

    @Column(name = "unit_cost", precision = 10, scale = 2)
    private BigDecimal unitCost;

    @Column(nullable = false)
    private LocalDateTime date = LocalDateTime.now();

    @ManyToOne
    @JoinColumn(name = "app_user_id")
    private AppUser appUser;

    @Column(length = 100)
    private String reference;
}
