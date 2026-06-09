package com.ues.controlstock.service;

import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.ues.controlstock.dto.LotDTO;
import com.ues.controlstock.entity.Lot;
import com.ues.controlstock.repository.LotRepository;
import com.ues.controlstock.repository.ProductRepository;

// Lógica de negocio para la gestión de lotes
@Service
public class LotService {

    @Autowired private LotRepository repository;
    @Autowired private ProductRepository productRepository;

    // Retorna todos los lotes registrados
    public List<LotDTO> findAll() {
        return repository.findAll().stream()
                .map(this::toDTO).collect(Collectors.toList());
    }

    // Crea un nuevo lote
    public LotDTO save(LotDTO dto) {
        Lot l = new Lot();
        return toDTO(repository.save(fill(l, dto)));
    }

    // Actualiza un lote existente
    public LotDTO update(Long id, LotDTO dto) {
        Lot l = repository.findById(id).orElseThrow();
        return toDTO(repository.save(fill(l, dto)));
    }

    // Elimina un lote por su ID
    public void delete(Long id) {
        repository.deleteById(id);
    }

    // Rellena los campos del lote desde el DTO
    private Lot fill(Lot l, LotDTO dto) {
        l.setLotCode(dto.getLotCode());
        l.setExpirationDate(dto.getExpirationDate());
        l.setQuantity(dto.getQuantity());
        if (dto.getProductId() != null)
            l.setProduct(productRepository.findById(dto.getProductId()).orElse(null));
        return l;
    }

    // Convierte la entidad Lot a DTO incluyendo datos del producto
    private LotDTO toDTO(Lot l) {
        return new LotDTO(
                l.getLotId(),
                l.getProduct() != null ? l.getProduct().getProductId() : null,
                l.getProduct() != null ? l.getProduct().getDescription() : null,
                l.getLotCode(), l.getExpirationDate(), l.getQuantity());
    }
}