package com.ues.controlstock.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class WarehouseDTO {
    private Long warehouseId;
    private String name;
    private String location;
    private String phone1;
    private String phone2;
}
