package com.ues.controlstock.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class RoleDTO {
    private Long roleId;
    private String roleName;
    private String description;
}