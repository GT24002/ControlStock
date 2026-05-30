package com.ues.controlstock.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.ues.controlstock.dto.PurchaseOrderDTO;
import com.ues.controlstock.service.PurchaseOrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/purchase-orders")
@Tag(name = "Purchase Orders", description = "Gestión de órdenes de compra")
public class PurchaseOrderController {

    @Autowired private PurchaseOrderService service;

    // Retorna la lista completa de órdenes de compra — 200 OK
    @GetMapping
    @Operation(summary = "Obtener todas las órdenes")
    public ResponseEntity<List<PurchaseOrderDTO>> getAll() {
        return ResponseEntity.ok(service.findAll());
    }

    // Crea una nueva orden de compra — 201 Created
    @PostMapping
    @Operation(summary = "Crear orden de compra")
    public ResponseEntity<PurchaseOrderDTO> create(@RequestBody PurchaseOrderDTO dto) {
        return ResponseEntity.status(201).body(service.save(dto));
    }

    // Actualiza una orden de compra existente — 200 OK
    @PutMapping("/{id}")
    @Operation(summary = "Actualizar orden de compra")
    public ResponseEntity<PurchaseOrderDTO> update(@PathVariable Long id, @RequestBody PurchaseOrderDTO dto) {
        return ResponseEntity.ok(service.update(id, dto));
    }

    // Elimina una orden de compra por ID — 204 No Content
    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar orden de compra")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
