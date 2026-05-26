package com.ues.controlstock.dto;

import java.math.BigDecimal;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class PurchaseOrderDetailDTO {
    private Long podId;
    private Long poId;
    private Long productId;
    private String productDescription;
    private BigDecimal quantity;
    private BigDecimal unitCost;
    private BigDecimal subtotal;
}
