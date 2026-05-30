package com.ues.controlstock.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.ues.controlstock.dto.RoleDTO;
import com.ues.controlstock.entity.Role;
import com.ues.controlstock.repository.RoleRepository;

// Lógica de negocio para la gestión de roles
@Service
public class RoleService {

    private final RoleRepository roleRepository;

    public RoleService(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    // Crea un nuevo rol
    public RoleDTO save(RoleDTO dto) {
        Role role = new Role();
        role.setRoleName(dto.getRoleName());
        role.setDescription(dto.getDescription());

        Role savedRole = roleRepository.save(role);
        dto.setRoleId(savedRole.getRoleId());

        return dto;
    }

    // Retorna un rol específico por su ID
    public Optional<RoleDTO> get(Long id) {
        return roleRepository.findById(id)
            .map(role -> new RoleDTO(
                role.getRoleId(),
                role.getRoleName(),
                role.getDescription()
            ));
    }

    // Retorna todos los roles registrados
    public List<RoleDTO> findAll() {
        return roleRepository.findAll()
            .stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }

    // Actualiza un rol existente
    public RoleDTO update(Long id, RoleDTO updatedData) {
        Role role = roleRepository.findById(id).orElseThrow();
        role.setRoleName(updatedData.getRoleName());
        role.setDescription(updatedData.getDescription());
        return convertToDTO(roleRepository.save(role));
    }

    // Elimina un rol por su ID — retorna true si fue eliminado
    public boolean delete(Long id) {
        if (roleRepository.existsById(id)) {
            roleRepository.deleteById(id);
            return true;
        }
        return false;
    }

    // Convierte la entidad Role a DTO
    private RoleDTO convertToDTO(Role role) {
        return new RoleDTO(
            role.getRoleId(),
            role.getRoleName(),
            role.getDescription()
        );
    }
}