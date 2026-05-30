package com.ues.controlstock.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.ues.controlstock.dto.WarehouseDTO;
import com.ues.controlstock.service.WarehouseService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/warehouses")
@Tag(name = "Warehouses", description = "CRUD de almacenes")
public class WarehouseController {

    @Autowired private WarehouseService service;

    // Retorna la lista completa de almacenes — 200 OK
    @GetMapping
    @Operation(summary = "Obtener todos los almacenes")
    public ResponseEntity<List<WarehouseDTO>> getAll() {
        return ResponseEntity.ok(service.findAll());
    }

    // Crea un nuevo almacén — 201 Created
    @PostMapping
    @Operation(summary = "Crear almacén")
    public ResponseEntity<WarehouseDTO> create(@RequestBody WarehouseDTO dto) {
        return ResponseEntity.status(201).body(service.save(dto));
    }

    // Actualiza un almacén existente — 200 OK
    @PutMapping("/{id}")
    @Operation(summary = "Actualizar almacén")
    public ResponseEntity<WarehouseDTO> update(@PathVariable Long id, @RequestBody WarehouseDTO dto) {
        return ResponseEntity.ok(service.update(id, dto));
    }

    // Elimina un almacén por ID — 204 No Content
    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar almacén")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
