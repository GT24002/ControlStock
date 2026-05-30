package com.ues.controlstock.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.ues.controlstock.dto.InventoryDTO;
import com.ues.controlstock.service.InventoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/inventory")
@Tag(name = "Inventory", description = "Gestión de inventario")
public class InventoryController {

    @Autowired private InventoryService service;

    // Retorna todo el inventario — 200 OK
    @GetMapping
    @Operation(summary = "Obtener todo el inventario")
    public ResponseEntity<List<InventoryDTO>> getAll() {
        return ResponseEntity.ok(service.findAll());
    }

    // Retorna el inventario filtrado por almacén — 200 OK
    @GetMapping("/warehouse/{warehouseId}")
    @Operation(summary = "Inventario por almacén")
    public ResponseEntity<List<InventoryDTO>> getByWarehouse(@PathVariable Long warehouseId) {
        return ResponseEntity.ok(service.findByWarehouse(warehouseId));
    }

    // Crea un nuevo registro de inventario — 201 Created
    @PostMapping
    @Operation(summary = "Crear registro de inventario")
    public ResponseEntity<InventoryDTO> create(@RequestBody InventoryDTO dto) {
        return ResponseEntity.status(201).body(service.save(dto));
    }

    // Actualiza un registro de inventario existente — 200 OK
    @PutMapping("/{id}")
    @Operation(summary = "Actualizar inventario")
    public ResponseEntity<InventoryDTO> update(@PathVariable Long id, @RequestBody InventoryDTO dto) {
        return ResponseEntity.ok(service.update(id, dto));
    }

    // Elimina un registro de inventario por ID — 204 No Content
    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar registro de inventario")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
