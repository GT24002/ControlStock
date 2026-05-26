package com.ues.controlstock.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.ues.controlstock.entity.Inventory;

public interface InventoryRepository extends JpaRepository<Inventory, Long> {
    List<Inventory> findByWarehouse_WarehouseId(Long warehouseId);
    List<Inventory> findByProduct_ProductId(Long productId);
    Optional<Inventory> findByProduct_ProductIdAndWarehouse_WarehouseId(Long productId, Long warehouseId);
}
