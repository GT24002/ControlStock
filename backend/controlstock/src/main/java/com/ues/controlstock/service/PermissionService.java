package com.ues.controlstock.service;

import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.ues.controlstock.dto.PermissionDTO;
import com.ues.controlstock.entity.Permission;
import com.ues.controlstock.repository.PermissionRepository;

// Lógica de negocio para la gestión de permisos
@Service
public class PermissionService {

    @Autowired private PermissionRepository repository;

    // Retorna todos los permisos registrados
    public List<PermissionDTO> findAll() {
        return repository.findAll().stream()
                .map(this::toDTO).collect(Collectors.toList());
    }

    // Crea un nuevo permiso
    public PermissionDTO save(PermissionDTO dto) {
        Permission p = new Permission();
        p.setPermissionName(dto.getPermissionName());
        p.setDescription(dto.getDescription());
        return toDTO(repository.save(p));
    }

    // Actualiza un permiso existente
    public PermissionDTO update(Long id, PermissionDTO dto) {
        Permission p = repository.findById(id).orElseThrow();
        p.setPermissionName(dto.getPermissionName());
        p.setDescription(dto.getDescription());
        return toDTO(repository.save(p));
    }

    // Elimina un permiso por su ID
    public void delete(Long id) {
        repository.deleteById(id);
    }

    // Convierte la entidad Permission a DTO
    private PermissionDTO toDTO(Permission p) {
        return new PermissionDTO(p.getPermissionId(), p.getPermissionName(), p.getDescription());
    }
}