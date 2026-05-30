package com.ues.controlstock.service;

import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.ues.controlstock.dto.SupplierDTO;
import com.ues.controlstock.entity.Supplier;
import com.ues.controlstock.repository.SupplierRepository;

// Lógica de negocio para la gestión de proveedores
@Service
public class SupplierService {

    @Autowired private SupplierRepository repository;

    // Retorna todos los proveedores registrados
    public List<SupplierDTO> findAll() {
        return repository.findAll().stream()
                .map(this::toDTO).collect(Collectors.toList());
    }

    // Crea un nuevo proveedor
    public SupplierDTO save(SupplierDTO dto) {
        Supplier s = new Supplier();
        s.setName(dto.getName());
        s.setContact(dto.getContact());
        s.setEmail(dto.getEmail());
        s.setPhone(dto.getPhone());
        s.setAddress(dto.getAddress());
        return toDTO(repository.save(s));
    }

    // Actualiza un proveedor existente
    public SupplierDTO update(Long id, SupplierDTO dto) {
        Supplier s = repository.findById(id).orElseThrow();
        s.setName(dto.getName());
        s.setContact(dto.getContact());
        s.setEmail(dto.getEmail());
        s.setPhone(dto.getPhone());
        s.setAddress(dto.getAddress());
        return toDTO(repository.save(s));
    }

    // Elimina un proveedor por su ID
    public void delete(Long id) {
        repository.deleteById(id);
    }

    // Convierte la entidad Supplier a DTO
    private SupplierDTO toDTO(Supplier s) {
        return new SupplierDTO(s.getSupplierId(), s.getName(), s.getContact(),
                s.getEmail(), s.getPhone(), s.getAddress());
    }
}