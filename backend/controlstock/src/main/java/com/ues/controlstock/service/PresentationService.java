package com.ues.controlstock.service;

import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.ues.controlstock.dto.PresentationDTO;
import com.ues.controlstock.entity.Presentation;
import com.ues.controlstock.repository.PresentationRepository;
import com.ues.controlstock.repository.ProductRepository;

// Lógica de negocio para la gestión de presentaciones de productos
@Service
public class PresentationService {

    @Autowired private PresentationRepository repository;
    @Autowired private ProductRepository productRepository;

    // Retorna todas las presentaciones registradas
    public List<PresentationDTO> findAll() {
        return repository.findAll().stream()
                .map(this::toDTO).collect(Collectors.toList());
    }

    // Retorna las presentaciones de un producto específico
    public List<PresentationDTO> findByProduct(Long productId) {
        return repository.findByProduct_ProductId(productId).stream()
                .map(this::toDTO).collect(Collectors.toList());
    }

    // Crea una nueva presentación
    public PresentationDTO save(PresentationDTO dto) {
        Presentation p = new Presentation();
        return toDTO(repository.save(fill(p, dto)));
    }

    // Actualiza una presentación existente
    public PresentationDTO update(Long id, PresentationDTO dto) {
        Presentation p = repository.findById(id).orElseThrow();
        return toDTO(repository.save(fill(p, dto)));
    }

    // Elimina una presentación por su ID
    public void delete(Long id) {
        repository.deleteById(id);
    }

    // Rellena los campos de la presentación desde el DTO
    private Presentation fill(Presentation p, PresentationDTO dto) {
        p.setName(dto.getName());
        p.setConversionFactor(dto.getConversionFactor());
        p.setBaseUnit(dto.getBaseUnit());
        p.setBarcode(dto.getBarcode());
        if (dto.getProductId() != null)
            p.setProduct(productRepository.findById(dto.getProductId()).orElse(null));
        return p;
    }

    // Convierte la entidad Presentation a DTO incluyendo datos del producto
    private PresentationDTO toDTO(Presentation p) {
        return new PresentationDTO(
                p.getPresentationId(),
                p.getProduct() != null ? p.getProduct().getProductId() : null,
                p.getProduct() != null ? p.getProduct().getDescription() : null,
                p.getName(), p.getConversionFactor(), p.getBaseUnit(), p.getBarcode());
    }
}