package com.ues.controlstock.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.ues.controlstock.dto.SupplierDTO;
import com.ues.controlstock.service.SupplierService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/suppliers")
@Tag(name = "Suppliers", description = "CRUD de proveedores")
public class SupplierController {

    @Autowired private SupplierService service;

    // Retorna la lista completa de proveedores — 200 OK
    @GetMapping
    @Operation(summary = "Obtener todos los proveedores")
    public ResponseEntity<List<SupplierDTO>> getAll() {
        return ResponseEntity.ok(service.findAll());
    }

    // Crea un nuevo proveedor — 201 Created
    @PostMapping
    @Operation(summary = "Crear proveedor")
    public ResponseEntity<SupplierDTO> create(@RequestBody SupplierDTO dto) {
        return ResponseEntity.status(201).body(service.save(dto));
    }

    // Actualiza un proveedor existente — 200 OK
    @PutMapping("/{id}")
    @Operation(summary = "Actualizar proveedor")
    public ResponseEntity<SupplierDTO> update(@PathVariable Long id, @RequestBody SupplierDTO dto) {
        return ResponseEntity.ok(service.update(id, dto));
    }

    // Elimina un proveedor por ID — 204 No Content
    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar proveedor")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
