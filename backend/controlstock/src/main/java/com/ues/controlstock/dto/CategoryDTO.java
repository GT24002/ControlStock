package com.ues.controlstock.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class CategoryDTO {
    private Long categoryId;
    private String name;
    private String description;
}
