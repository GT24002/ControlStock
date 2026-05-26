package com.ues.controlstock.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class AppUserDTO {
    private Long userId;
    private String username;
    private String name;
    private String lastname;
    private String email;
    private Boolean status;
}
