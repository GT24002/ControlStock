package com.ues.controlstock.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ues.controlstock.dto.RoleDTO;
import com.ues.controlstock.service.RoleService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/roles")
@Tag(name = "Roles", description = "CRUD de roles")
public class RoleController {
    @Autowired
    private RoleService service;

    @GetMapping
    @Operation(summary = "Obtener todos los roles")
    public List<RoleDTO> getAll() {
        return service.findAll();
    }

    @PostMapping
    @Operation(summary = "Crear un rol")
    public RoleDTO create(@RequestBody RoleDTO dto) {
        return service.save(dto);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar un rol")
    public RoleDTO update(@PathVariable Long id, @RequestBody RoleDTO dto) {
        return service.update(id, dto);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar un rol")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }  
}
