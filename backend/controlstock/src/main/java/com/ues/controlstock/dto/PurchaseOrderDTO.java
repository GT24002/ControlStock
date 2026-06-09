package com.ues.controlstock.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class PurchaseOrderDTO {
    private Long poId;
    private Long supplierId;
    private String supplierName;
    private Long appUserId;
    private String username;
    private LocalDateTime orderDate;
    private String status;
    private BigDecimal totalAmount;
}
