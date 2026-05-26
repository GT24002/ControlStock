package com.ues.controlstock.dto;

import java.math.BigDecimal;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class InventoryDTO {
    private Long inventoryId;
    private Long productId;
    private String productSku;
    private String productDescription;
    private Long warehouseId;
    private String warehouseName;
    private BigDecimal currentQuantity;
    private BigDecimal minimum;
    private BigDecimal maximum;
}
