package com.ues.controlstock.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.ues.controlstock.dto.PermissionDTO;
import com.ues.controlstock.service.PermissionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/permissions")
@Tag(name = "Permissions", description = "CRUD de permisos")
public class PermissionController {

    @Autowired private PermissionService service;

    // Retorna la lista completa de permisos — 200 OK
    @GetMapping
    @Operation(summary = "Obtener todos los permisos")
    public ResponseEntity<List<PermissionDTO>> getAll() {
        return ResponseEntity.ok(service.findAll());
    }

    // Crea un nuevo permiso — 201 Created
    @PostMapping
    @Operation(summary = "Crear permiso")
    public ResponseEntity<PermissionDTO> create(@RequestBody PermissionDTO dto) {
        return ResponseEntity.status(201).body(service.save(dto));
    }

    // Actualiza un permiso existente — 200 OK
    @PutMapping("/{id}")
    @Operation(summary = "Actualizar permiso")
    public ResponseEntity<PermissionDTO> update(@PathVariable Long id, @RequestBody PermissionDTO dto) {
        return ResponseEntity.ok(service.update(id, dto));
    }

    // Elimina un permiso por ID — 204 No Content
    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar permiso")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
