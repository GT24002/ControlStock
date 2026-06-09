package com.ues.controlstock.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.ues.controlstock.dto.MovementDTO;
import com.ues.controlstock.entity.Inventory;
import com.ues.controlstock.entity.Movement;
import com.ues.controlstock.repository.AppUserRepository;
import com.ues.controlstock.repository.InventoryRepository;
import com.ues.controlstock.repository.MovementRepository;
import com.ues.controlstock.repository.ProductRepository;
import com.ues.controlstock.repository.WarehouseRepository;

@Service
public class MovementService {

    @Autowired private MovementRepository repository;
    @Autowired private ProductRepository productRepository;
    @Autowired private WarehouseRepository warehouseRepository;
    @Autowired private AppUserRepository userRepository;
    @Autowired private InventoryRepository inventoryRepository;

    // Obtiene todos los movimientos registrados
    public List<MovementDTO> findAll() {
        return repository.findAll().stream()
                .map(this::toDTO).collect(Collectors.toList());
    }

    // Registra un movimiento y actualiza el inventario automáticamente
    @Transactional
    public MovementDTO save(MovementDTO dto) {
        Movement m = new Movement();
        fill(m, dto);
        Movement saved = repository.save(m);

        // Actualiza el stock según el tipo de movimiento
        updateInventory(dto);

        return toDTO(saved);
    }

    // Actualiza el inventario según el tipo de movimiento
    private void updateInventory(MovementDTO dto) {
        if (dto.getProductId() == null || dto.getWarehouseId() == null) return;

        // Busca el registro de inventario para ese producto y almacén
        Inventory inventory = inventoryRepository
                .findByProduct_ProductIdAndWarehouse_WarehouseId(
                        dto.getProductId(), dto.getWarehouseId())
                .orElse(null);

        if (inventory == null) return;

        BigDecimal quantity = dto.getQuantity();

        switch (dto.getType()) {
            case "entry" ->
                // Entrada: suma la cantidad al stock actual
                inventory.setCurrentQuantity(inventory.getCurrentQuantity().add(quantity));
            case "exit" ->
                // Salida: resta la cantidad al stock actual
                inventory.setCurrentQuantity(inventory.getCurrentQuantity().subtract(quantity));
            case "transfer" ->
                // Transferencia: resta del almacén origen
                inventory.setCurrentQuantity(inventory.getCurrentQuantity().subtract(quantity));
        }

        inventoryRepository.save(inventory);
    }

    // Rellena los campos del movimiento desde el DTO
    private Movement fill(Movement m, MovementDTO dto) {
        m.setType(dto.getType());
        m.setQuantity(dto.getQuantity());
        m.setUnitCost(dto.getUnitCost());
        m.setReference(dto.getReference());
        if (dto.getProductId() != null)
            m.setProduct(productRepository.findById(dto.getProductId()).orElse(null));
        if (dto.getWarehouseId() != null)
            m.setWarehouse(warehouseRepository.findById(dto.getWarehouseId()).orElse(null));
        if (dto.getAppUserId() != null)
            m.setAppUser(userRepository.findById(dto.getAppUserId()).orElse(null));
        return m;
    }

    // Convierte entidad Movement a DTO
    private MovementDTO toDTO(Movement m) {
        return new MovementDTO(
                m.getMovementId(),
                m.getProduct() != null ? m.getProduct().getProductId() : null,
                m.getProduct() != null ? m.getProduct().getDescription() : null,
                m.getWarehouse() != null ? m.getWarehouse().getWarehouseId() : null,
                m.getWarehouse() != null ? m.getWarehouse().getName() : null,
                m.getType(),
                m.getQuantity(),
                m.getUnitCost(),
                m.getDate(),
                m.getAppUser() != null ? m.getAppUser().getUserId() : null,
                m.getAppUser() != null ? m.getAppUser().getUsername() : null,
                m.getReference());
    }
}