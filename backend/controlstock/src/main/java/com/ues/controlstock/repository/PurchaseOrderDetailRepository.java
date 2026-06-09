package com.ues.controlstock.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.ues.controlstock.entity.PurchaseOrderDetail;

public interface PurchaseOrderDetailRepository extends JpaRepository<PurchaseOrderDetail, Long> {
    List<PurchaseOrderDetail> findByPurchaseOrder_PoId(Long poId);
}
