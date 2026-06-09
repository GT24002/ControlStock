package com.ues.controlstock.service;

import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.ues.controlstock.dto.InventoryDTO;
import com.ues.controlstock.entity.Inventory;
import com.ues.controlstock.repository.InventoryRepository;
import com.ues.controlstock.repository.ProductRepository;
import com.ues.controlstock.repository.WarehouseRepository;

// Lógica de negocio para la gestión de inventario
@Service
public class InventoryService {

    @Autowired private InventoryRepository repository;
    @Autowired private ProductRepository productRepository;
    @Autowired private WarehouseRepository warehouseRepository;

    // Retorna todo el inventario
    public List<InventoryDTO> findAll() {
        return repository.findAll().stream()
                .map(this::toDTO).collect(Collectors.toList());
    }

    // Retorna el inventario filtrado por almacén
    public List<InventoryDTO> findByWarehouse(Long warehouseId) {
        return repository.findByWarehouse_WarehouseId(warehouseId).stream()
                .map(this::toDTO).collect(Collectors.toList());
    }

    // Crea un nuevo registro de inventario
    public InventoryDTO save(InventoryDTO dto) {
        Inventory i = new Inventory();
        return toDTO(repository.save(fill(i, dto)));
    }

    // Actualiza un registro de inventario existente
    public InventoryDTO update(Long id, InventoryDTO dto) {
        Inventory i = repository.findById(id).orElseThrow();
        return toDTO(repository.save(fill(i, dto)));
    }

    // Elimina un registro de inventario por su ID
    public void delete(Long id) {
        repository.deleteById(id);
    }

    // Rellena los campos del inventario desde el DTO
    private Inventory fill(Inventory i, InventoryDTO dto) {
        i.setCurrentQuantity(dto.getCurrentQuantity());
        i.setMinimum(dto.getMinimum());
        i.setMaximum(dto.getMaximum());
        if (dto.getProductId() != null)
            i.setProduct(productRepository.findById(dto.getProductId()).orElse(null));
        if (dto.getWarehouseId() != null)
            i.setWarehouse(warehouseRepository.findById(dto.getWarehouseId()).orElse(null));
        return i;
    }

    // Convierte la entidad Inventory a DTO incluyendo datos del producto y almacén
    private InventoryDTO toDTO(Inventory i) {
        return new InventoryDTO(
                i.getInventoryId(),
                i.getProduct() != null ? i.getProduct().getProductId() : null,
                i.getProduct() != null ? i.getProduct().getSku() : null,
                i.getProduct() != null ? i.getProduct().getDescription() : null,
                i.getWarehouse() != null ? i.getWarehouse().getWarehouseId() : null,
                i.getWarehouse() != null ? i.getWarehouse().getName() : null,
                i.getCurrentQuantity(), i.getMinimum(), i.getMaximum());
    }
}
