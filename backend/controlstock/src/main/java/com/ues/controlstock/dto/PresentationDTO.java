package com.ues.controlstock.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class PresentationDTO {
    private Long presentationId;
    private Long productId;
    private String productName;
    private String name;
    private Integer conversionFactor;
    private String baseUnit;
    private String barcode;
}
