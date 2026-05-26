package com.ues.controlstock.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.ues.controlstock.entity.Movement;

public interface MovementRepository extends JpaRepository<Movement, Long> {
    List<Movement> findByProduct_ProductId(Long productId);
    List<Movement> findByWarehouse_WarehouseId(Long warehouseId);
    List<Movement> findByType(String type);
}
