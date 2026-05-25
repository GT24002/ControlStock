package com.ues.controlstock.dto;

import java.math.BigDecimal;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class ProductDTO {
    private Long productId;
    private String sku;
    private String description;
    private Long categoryId;
    private String categoryName;
    private Long supplierId;
    private String supplierName;
    private String baseUnit;
    private BigDecimal unitCost;
    private BigDecimal salePrice;
    private String barcode;
    private String imageUrl;
}
