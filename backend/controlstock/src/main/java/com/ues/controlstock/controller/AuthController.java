package com.ues.controlstock.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import com.ues.controlstock.dto.LoginRequestDTO;
import com.ues.controlstock.dto.LoginResponseDTO;
import com.ues.controlstock.entity.AppUserRole;
import com.ues.controlstock.repository.AppUserRoleRepository;
import com.ues.controlstock.security.JwtService;
import com.ues.controlstock.security.UserDetailsImpl;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/auth")
@Tag(name = "Auth", description = "Autenticación y generación de token JWT")
public class AuthController {

    @Autowired private AuthenticationManager authenticationManager;
    @Autowired private JwtService jwtService;
    @Autowired private AppUserRoleRepository appUserRoleRepository;

    // Login — autentica al usuario y retorna un token JWT con su rol
    @PostMapping("/login")
    @Operation(summary = "Login y obtención de token JWT")
    public ResponseEntity<LoginResponseDTO> login(@RequestBody LoginRequestDTO request) {

        // Autentica usuario contra la base de datos
        Authentication auth = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                request.getUsername(),
                request.getPassword()
            )
        );

        UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();

        // Busca el rol asignado al usuario, si no tiene asigna "basic" por defecto
        List<AppUserRole> roles = appUserRoleRepository.findByAppUser_UserId(userDetails.getUserId());
        String role = roles.isEmpty() ? "basic" : roles.get(0).getRole().getRoleName();

        // Genera el token JWT incluyendo el rol del usuario
        String token = jwtService.generateToken(userDetails.getUsername(), role);

        // Retorna 200 OK con el token y datos del usuario
        return ResponseEntity.ok(new LoginResponseDTO(
            token,
            userDetails.getUsername(),
            userDetails.getUserId(),
            role
        ));
    }
}
