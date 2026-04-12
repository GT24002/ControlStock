package com.ues.controlstock.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.ues.controlstock.dto.RoleDTO;
import com.ues.controlstock.entity.Role;
import com.ues.controlstock.repository.RoleRepository;


@Service
public class RoleService {
    private final RoleRepository roleRepository;

    public RoleService(RoleRepository roleRepository){
        this.roleRepository = roleRepository;
    }
    

    // Crea
    public RoleDTO save(RoleDTO dto){
        Role role = new Role();
        role.setRoleName(dto.getRoleName());
        role.setDescription(dto.getDescription());

        Role savedRole = roleRepository.save(role);
        dto.setId(savedRole.getId());

        return dto;
    }


    // Obtener especifico
    public Optional<RoleDTO> get(Long id){
        return roleRepository.findById(id)
            .map(role -> new RoleDTO(
                role.getId(),
                role.getRoleName(),
                role.getDescription()
            )
        );
    }


    // Obtener todos
    public List<RoleDTO> findAll(){
        return roleRepository.findAll()
            .stream().map(this::convertToDTO)
            .collect(Collectors.toList());
    }


    // Actualizar
    public RoleDTO update(Long id, RoleDTO updatedData){
        Role role = roleRepository.findById(id).orElseThrow();

        role.setRoleName(updatedData.getRoleName());
        role.setDescription(updatedData.getDescription());
     
        return convertToDTO(roleRepository.save(role));
    }


    // Borrar
    public boolean delete(Long id){
        if (roleRepository.existsById(id)){
            roleRepository.deleteById(id);
            return true;
        }
        return false;
    }


    // Método auxiliar para convertir roles a dtos
    private RoleDTO convertToDTO(Role role){
        RoleDTO dto = new RoleDTO(
            role.getId(),
            role.getRoleName(),
            role.getDescription()
        );
        return dto;
    }
}
