package com.ues.controlstock.service;

import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.ues.controlstock.dto.AppUserDTO;
import com.ues.controlstock.entity.AppUser;
import com.ues.controlstock.repository.AppUserRepository;

// Lógica de negocio para la gestión de usuarios
@Service
public class AppUserService {

    @Autowired private AppUserRepository repository;
    @Autowired private PasswordEncoder passwordEncoder;

    // Retorna todos los usuarios registrados
    public List<AppUserDTO> findAll() {
        return repository.findAll().stream()
                .map(this::toDTO).collect(Collectors.toList());
    }

    // Crea un nuevo usuario encriptando su contraseña antes de guardarla
    public AppUserDTO save(AppUserDTO dto, String password) {
        AppUser u = new AppUser();
        u.setUsername(dto.getUsername());
        u.setName(dto.getName());
        u.setLastname(dto.getLastname());
        u.setEmail(dto.getEmail());
        u.setStatus(dto.getStatus() != null ? dto.getStatus() : true);
        u.setPasswordHash(passwordEncoder.encode(password));
        return toDTO(repository.save(u));
    }

    // Actualiza nombre, apellido, email y estado — el username no se modifica
    public AppUserDTO update(Long id, AppUserDTO dto) {
        AppUser u = repository.findById(id).orElseThrow();
        u.setName(dto.getName());
        u.setLastname(dto.getLastname());
        u.setEmail(dto.getEmail());
        u.setStatus(dto.getStatus());
        return toDTO(repository.save(u));
    }

    // Elimina un usuario por su ID
    public void delete(Long id) {
        repository.deleteById(id);
    }

    // Convierte la entidad AppUser a DTO para no exponer datos sensibles
    private AppUserDTO toDTO(AppUser u) {
        return new AppUserDTO(u.getUserId(), u.getUsername(),
                u.getName(), u.getLastname(), u.getEmail(), u.getStatus());
    }
}
