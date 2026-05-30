package com.ues.controlstock.service;

import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.ues.controlstock.dto.ProductDTO;
import com.ues.controlstock.entity.Product;
import com.ues.controlstock.repository.CategoryRepository;
import com.ues.controlstock.repository.ProductRepository;
import com.ues.controlstock.repository.SupplierRepository;

// Lógica de negocio para la gestión de productos
@Service
public class ProductService {

    @Autowired private ProductRepository repository;
    @Autowired private CategoryRepository categoryRepository;
    @Autowired private SupplierRepository supplierRepository;

    // Retorna todos los productos registrados
    public List<ProductDTO> findAll() {
        return repository.findAll().stream()
                .map(this::toDTO).collect(Collectors.toList());
    }

    // Crea un nuevo producto
    public ProductDTO save(ProductDTO dto) {
        Product p = new Product();
        return toDTO(repository.save(fillProduct(p, dto)));
    }

    // Actualiza un producto existente
    public ProductDTO update(Long id, ProductDTO dto) {
        Product p = repository.findById(id).orElseThrow();
        return toDTO(repository.save(fillProduct(p, dto)));
    }

    // Elimina un producto por su ID
    public void delete(Long id) {
        repository.deleteById(id);
    }

    // Rellena los campos del producto desde el DTO, incluyendo categoría y proveedor
    private Product fillProduct(Product p, ProductDTO dto) {
        p.setSku(dto.getSku());
        p.setDescription(dto.getDescription());
        p.setBaseUnit(dto.getBaseUnit());
        p.setUnitCost(dto.getUnitCost());
        p.setSalePrice(dto.getSalePrice());
        p.setBarcode(dto.getBarcode());
        p.setImageUrl(dto.getImageUrl());
        if (dto.getCategoryId() != null)
            p.setCategory(categoryRepository.findById(dto.getCategoryId()).orElse(null));
        if (dto.getSupplierId() != null)
            p.setSupplier(supplierRepository.findById(dto.getSupplierId()).orElse(null));
        return p;
    }

    // Convierte la entidad Product a DTO incluyendo datos de categoría y proveedor
    private ProductDTO toDTO(Product p) {
        return new ProductDTO(
                p.getProductId(), p.getSku(), p.getDescription(),
                p.getCategory() != null ? p.getCategory().getCategoryId() : null,
                p.getCategory() != null ? p.getCategory().getName() : null,
                p.getSupplier() != null ? p.getSupplier().getSupplierId() : null,
                p.getSupplier() != null ? p.getSupplier().getName() : null,
                p.getBaseUnit(), p.getUnitCost(), p.getSalePrice(),
                p.getBarcode(), p.getImageUrl());
    }
}