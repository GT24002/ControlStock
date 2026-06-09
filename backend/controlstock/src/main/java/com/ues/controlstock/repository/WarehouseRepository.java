package com.ues.controlstock.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.ues.controlstock.entity.Warehouse;

public interface WarehouseRepository extends JpaRepository<Warehouse, Long> {
}
