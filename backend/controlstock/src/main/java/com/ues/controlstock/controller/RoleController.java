package com.ues.controlstock.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.ues.controlstock.dto.RoleDTO;
import com.ues.controlstock.service.RoleService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/roles")
@Tag(name = "Roles", description = "CRUD de roles")
public class RoleController {

    @Autowired private RoleService service;

    // Retorna la lista completa de roles — 200 OK
    @GetMapping
    @Operation(summary = "Obtener todos los roles")
    public ResponseEntity<List<RoleDTO>> getAll() {
        return ResponseEntity.ok(service.findAll());
    }

    // Crea un nuevo rol — 201 Created
    @PostMapping
    @Operation(summary = "Crear un rol")
    public ResponseEntity<RoleDTO> create(@RequestBody RoleDTO dto) {
        return ResponseEntity.status(201).body(service.save(dto));
    }

    // Actualiza un rol existente — 200 OK
    @PutMapping("/{id}")
    @Operation(summary = "Actualizar un rol")
    public ResponseEntity<RoleDTO> update(@PathVariable Long id, @RequestBody RoleDTO dto) {
        return ResponseEntity.ok(service.update(id, dto));
    }

    // Elimina un rol por ID — 204 No Content
    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar un rol")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
