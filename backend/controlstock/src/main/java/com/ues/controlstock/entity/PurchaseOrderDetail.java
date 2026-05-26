package com.ues.controlstock.entity;

import java.math.BigDecimal;
import jakarta.persistence.*;
import lombok.*;

// Línea de detalle de una orden de compra
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
@Entity
@Table(name = "purchase_order_detail")
public class PurchaseOrderDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "pod_id")
    private Long podId;

    @ManyToOne
    @JoinColumn(name = "po_id", nullable = false)
    private PurchaseOrder purchaseOrder;

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal quantity;

    @Column(name = "unit_cost", nullable = false, precision = 10, scale = 2)
    private BigDecimal unitCost;

    // subtotal es columna generada en DB, solo lectura
    @Column(precision = 12, scale = 2, insertable = false, updatable = false)
    private BigDecimal subtotal;
}
