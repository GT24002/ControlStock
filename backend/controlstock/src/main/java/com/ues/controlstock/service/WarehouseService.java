package com.ues.controlstock.service;

import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.ues.controlstock.dto.WarehouseDTO;
import com.ues.controlstock.entity.Warehouse;
import com.ues.controlstock.repository.WarehouseRepository;

// Lógica de negocio para la gestión de almacenes
@Service
public class WarehouseService {

    @Autowired private WarehouseRepository repository;

    // Retorna todos los almacenes registrados
    public List<WarehouseDTO> findAll() {
        return repository.findAll().stream()
                .map(this::toDTO).collect(Collectors.toList());
    }

    // Crea un nuevo almacén
    public WarehouseDTO save(WarehouseDTO dto) {
        Warehouse w = new Warehouse();
        w.setName(dto.getName());
        w.setLocation(dto.getLocation());
        w.setPhone1(dto.getPhone1());
        w.setPhone2(dto.getPhone2());
        return toDTO(repository.save(w));
    }

    // Actualiza un almacén existente
    public WarehouseDTO update(Long id, WarehouseDTO dto) {
        Warehouse w = repository.findById(id).orElseThrow();
        w.setName(dto.getName());
        w.setLocation(dto.getLocation());
        w.setPhone1(dto.getPhone1());
        w.setPhone2(dto.getPhone2());
        return toDTO(repository.save(w));
    }

    // Elimina un almacén por su ID
    public void delete(Long id) {
        repository.deleteById(id);
    }

    // Convierte la entidad Warehouse a DTO
    private WarehouseDTO toDTO(Warehouse w) {
        return new WarehouseDTO(w.getWarehouseId(), w.getName(),
                w.getLocation(), w.getPhone1(), w.getPhone2());
    }
}
