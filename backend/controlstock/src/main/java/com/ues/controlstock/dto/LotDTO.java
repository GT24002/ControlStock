package com.ues.controlstock.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class LotDTO {
    private Long lotId;
    private Long productId;
    private String productDescription;
    private String lotCode;
    private LocalDate expirationDate;
    private BigDecimal quantity;
}
