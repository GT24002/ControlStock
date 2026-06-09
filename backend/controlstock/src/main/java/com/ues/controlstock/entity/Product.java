package com.ues.controlstock.entity;

import java.math.BigDecimal;
import jakarta.persistence.*;
import lombok.*;

// Producto del catálogo con su categoría, proveedor y precios
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
@Entity
@Table(name = "product")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "product_id")
    private Long productId;

    @Column(unique = true, nullable = false, length = 50)
    private String sku;

    @Column(nullable = false, length = 255)
    private String description;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    @ManyToOne
    @JoinColumn(name = "supplier_id")
    private Supplier supplier;

    @Column(name = "base_unit", nullable = false, length = 50)
    private String baseUnit;

    @Column(name = "unit_cost", precision = 10, scale = 2)
    private BigDecimal unitCost;

    @Column(name = "sale_price", precision = 10, scale = 2)
    private BigDecimal salePrice;

    @Column(unique = true, length = 50)
    private String barcode;

    @Column(name = "image_url", length = 255)
    private String imageUrl;
}
