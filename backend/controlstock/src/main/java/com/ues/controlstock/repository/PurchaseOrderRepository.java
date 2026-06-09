package com.ues.controlstock.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.ues.controlstock.entity.PurchaseOrder;

public interface PurchaseOrderRepository extends JpaRepository<PurchaseOrder, Long> {
    List<PurchaseOrder> findByStatus(String status);
    List<PurchaseOrder> findBySupplier_SupplierId(Long supplierId);
}
