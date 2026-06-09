package com.ues.controlstock.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class MovementDTO {
    private Long movementId;
    private Long productId;
    private String productDescription;
    private Long warehouseId;
    private String warehouseName;
    private String type;
    private BigDecimal quantity;
    private BigDecimal unitCost;
    private LocalDateTime date;
    private Long appUserId;
    private String username;
    private String reference;
}