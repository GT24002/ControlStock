package com.ues.controlstock.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.ues.controlstock.dto.LotDTO;
import com.ues.controlstock.service.LotService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/lots")
@Tag(name = "Lots", description = "Gestión de lotes")
public class LotController {

    @Autowired private LotService service;

    // Retorna la lista completa de lotes — 200 OK
    @GetMapping
    @Operation(summary = "Obtener todos los lotes")
    public ResponseEntity<List<LotDTO>> getAll() {
        return ResponseEntity.ok(service.findAll());
    }

    // Crea un nuevo lote — 201 Created
    @PostMapping
    @Operation(summary = "Crear lote")
    public ResponseEntity<LotDTO> create(@RequestBody LotDTO dto) {
        return ResponseEntity.status(201).body(service.save(dto));
    }

    // Actualiza un lote existente — 200 OK
    @PutMapping("/{id}")
    @Operation(summary = "Actualizar lote")
    public ResponseEntity<LotDTO> update(@PathVariable Long id, @RequestBody LotDTO dto) {
        return ResponseEntity.ok(service.update(id, dto));
    }

    // Elimina un lote por ID — 204 No Content
    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar lote")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
