package com.ues.controlstock.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class SupplierDTO {
    private Long supplierId;
    private String name;
    private String contact;
    private String email;
    private String phone;
    private String address;
}
