package com.ues.controlstock.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.ues.controlstock.entity.Supplier;

public interface SupplierRepository extends JpaRepository<Supplier, Long> {
}
