package com.ues.controlstock.entity;

import java.math.BigDecimal;
import jakarta.persistence.*;
import lombok.*;

// Stock actual de cada producto por almacén
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
@Entity
@Table(name = "inventory", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"product_id", "warehouse_id"})
})
public class Inventory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "inventory_id")
    private Long inventoryId;

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    @ManyToOne
    @JoinColumn(name = "warehouse_id")
    private Warehouse warehouse;

    @Column(name = "current_quantity", precision = 12, scale = 2)
    private BigDecimal currentQuantity = BigDecimal.ZERO;

    @Column(precision = 12, scale = 2)
    private BigDecimal minimum = BigDecimal.ZERO;

    @Column(precision = 12, scale = 2)
    private BigDecimal maximum = BigDecimal.ZERO;
}
