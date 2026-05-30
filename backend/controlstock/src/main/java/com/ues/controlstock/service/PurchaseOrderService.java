package com.ues.controlstock.service;

import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.ues.controlstock.dto.PurchaseOrderDTO;
import com.ues.controlstock.entity.PurchaseOrder;
import com.ues.controlstock.repository.AppUserRepository;
import com.ues.controlstock.repository.PurchaseOrderRepository;
import com.ues.controlstock.repository.SupplierRepository;

// Lógica de negocio para la gestión de órdenes de compra
@Service
public class PurchaseOrderService {

    @Autowired private PurchaseOrderRepository repository;
    @Autowired private SupplierRepository supplierRepository;
    @Autowired private AppUserRepository userRepository;

    // Retorna todas las órdenes de compra registradas
    public List<PurchaseOrderDTO> findAll() {
        return repository.findAll().stream()
                .map(this::toDTO).collect(Collectors.toList());
    }

    // Crea una nueva orden de compra
    public PurchaseOrderDTO save(PurchaseOrderDTO dto) {
        PurchaseOrder po = new PurchaseOrder();
        return toDTO(repository.save(fill(po, dto)));
    }

    // Actualiza una orden de compra existente
    public PurchaseOrderDTO update(Long id, PurchaseOrderDTO dto) {
        PurchaseOrder po = repository.findById(id).orElseThrow();
        return toDTO(repository.save(fill(po, dto)));
    }

    // Elimina una orden de compra por su ID
    public void delete(Long id) {
        repository.deleteById(id);
    }

    // Rellena los campos de la orden desde el DTO, incluyendo proveedor y usuario
    private PurchaseOrder fill(PurchaseOrder po, PurchaseOrderDTO dto) {
        po.setStatus(dto.getStatus());
        po.setTotalAmount(dto.getTotalAmount());
        if (dto.getSupplierId() != null)
            po.setSupplier(supplierRepository.findById(dto.getSupplierId()).orElse(null));
        if (dto.getAppUserId() != null)
            po.setAppUser(userRepository.findById(dto.getAppUserId()).orElse(null));
        return po;
    }

    // Convierte la entidad PurchaseOrder a DTO incluyendo datos del proveedor y usuario
    private PurchaseOrderDTO toDTO(PurchaseOrder po) {
        return new PurchaseOrderDTO(
                po.getPoId(),
                po.getSupplier() != null ? po.getSupplier().getSupplierId() : null,
                po.getSupplier() != null ? po.getSupplier().getName() : null,
                po.getAppUser() != null ? po.getAppUser().getUserId() : null,
                po.getAppUser() != null ? po.getAppUser().getUsername() : null,
                po.getOrderDate(), po.getStatus(), po.getTotalAmount());
    }
}