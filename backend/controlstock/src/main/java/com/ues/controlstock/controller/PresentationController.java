package com.ues.controlstock.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.ues.controlstock.dto.PresentationDTO;
import com.ues.controlstock.service.PresentationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/presentations")
@Tag(name = "Presentations", description = "CRUD de presentaciones")
public class PresentationController {

    @Autowired private PresentationService service;

    // Retorna la lista completa de presentaciones — 200 OK
    @GetMapping
    @Operation(summary = "Obtener todas las presentaciones")
    public ResponseEntity<List<PresentationDTO>> getAll() {
        return ResponseEntity.ok(service.findAll());
    }

    // Retorna las presentaciones de un producto específico — 200 OK
    @GetMapping("/product/{productId}")
    @Operation(summary = "Obtener presentaciones por producto")
    public ResponseEntity<List<PresentationDTO>> getByProduct(@PathVariable Long productId) {
        return ResponseEntity.ok(service.findByProduct(productId));
    }

    // Crea una nueva presentación — 201 Created
    @PostMapping
    @Operation(summary = "Crear presentación")
    public ResponseEntity<PresentationDTO> create(@RequestBody PresentationDTO dto) {
        return ResponseEntity.status(201).body(service.save(dto));
    }

    // Actualiza una presentación existente — 200 OK
    @PutMapping("/{id}")
    @Operation(summary = "Actualizar presentación")
    public ResponseEntity<PresentationDTO> update(@PathVariable Long id, @RequestBody PresentationDTO dto) {
        return ResponseEntity.ok(service.update(id, dto));
    }

    // Elimina una presentación por ID — 204 No Content
    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar presentación")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
