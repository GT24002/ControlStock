package com.ues.controlstock.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.ues.controlstock.dto.CategoryDTO;
import com.ues.controlstock.service.CategoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/categories")
@Tag(name = "Categories", description = "CRUD de categorías")
public class CategoryController {

    @Autowired private CategoryService service;

    // Retorna la lista completa de categorías — 200 OK
    @GetMapping
    @Operation(summary = "Obtener todas las categorías")
    public ResponseEntity<List<CategoryDTO>> getAll() {
        return ResponseEntity.ok(service.findAll());
    }

    // Crea una nueva categoría — 201 Created
    @PostMapping
    @Operation(summary = "Crear categoría")
    public ResponseEntity<CategoryDTO> create(@RequestBody CategoryDTO dto) {
        return ResponseEntity.status(201).body(service.save(dto));
    }

    // Actualiza una categoría existente — 200 OK
    @PutMapping("/{id}")
    @Operation(summary = "Actualizar categoría")
    public ResponseEntity<CategoryDTO> update(@PathVariable Long id, @RequestBody CategoryDTO dto) {
        return ResponseEntity.ok(service.update(id, dto));
    }

    // Elimina una categoría por ID — 204 No Content
    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar categoría")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
