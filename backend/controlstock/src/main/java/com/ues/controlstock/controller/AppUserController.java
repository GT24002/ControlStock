package com.ues.controlstock.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.ues.controlstock.dto.AppUserDTO;
import com.ues.controlstock.service.AppUserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/users")
@Tag(name = "Users", description = "Gestión de usuarios")
public class AppUserController {

    @Autowired private AppUserService service;

    // Retorna la lista completa de usuarios — 200 OK
    @GetMapping
    @Operation(summary = "Obtener todos los usuarios")
    public ResponseEntity<List<AppUserDTO>> getAll() {
        return ResponseEntity.ok(service.findAll());
    }

    // Crea un nuevo usuario con contraseña encriptada — 201 Created
    @PostMapping
    @Operation(summary = "Crear usuario")
    public ResponseEntity<AppUserDTO> create(
            @RequestBody AppUserDTO dto,
            @RequestParam String password) {
        return ResponseEntity.status(201).body(service.save(dto, password));
    }

    // Actualiza los datos de un usuario existente — 200 OK
    @PutMapping("/{id}")
    @Operation(summary = "Actualizar usuario")
    public ResponseEntity<AppUserDTO> update(@PathVariable Long id, @RequestBody AppUserDTO dto) {
        return ResponseEntity.ok(service.update(id, dto));
    }

    // Elimina un usuario por ID — 204 No Content
    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar usuario")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
