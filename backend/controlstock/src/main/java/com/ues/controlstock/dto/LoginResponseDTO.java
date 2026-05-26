package com.ues.controlstock.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class LoginResponseDTO {
    private String token;
    private String username;
    private Long userId;
    private String role;
}