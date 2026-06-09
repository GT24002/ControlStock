package com.ues.controlstock.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.ues.controlstock.dto.MovementDTO;
import com.ues.controlstock.service.MovementService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/movements")
@Tag(name = "Movements", description = "Registro de movimientos de stock")
public class MovementController {

    @Autowired private MovementService service;

    // Retorna el historial completo de movimientos — 200 OK
    @GetMapping
    @Operation(summary = "Obtener todos los movimientos")
    public ResponseEntity<List<MovementDTO>> getAll() {
        return ResponseEntity.ok(service.findAll());
    }

    // Registra un nuevo movimiento de stock — 201 Created
    @PostMapping
    @Operation(summary = "Registrar movimiento")
    public ResponseEntity<MovementDTO> create(@RequestBody MovementDTO dto) {
        return ResponseEntity.status(201).body(service.save(dto));
    }
}
