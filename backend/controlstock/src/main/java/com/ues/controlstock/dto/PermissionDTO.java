package com.ues.controlstock.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class PermissionDTO {
    private Long permissionId;
    private String permissionName;
    private String description;
}
