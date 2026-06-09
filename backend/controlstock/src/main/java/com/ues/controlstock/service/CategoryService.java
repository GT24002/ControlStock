package com.ues.controlstock.service;

import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.ues.controlstock.dto.CategoryDTO;
import com.ues.controlstock.entity.Category;
import com.ues.controlstock.repository.CategoryRepository;

// Lógica de negocio para la gestión de categorías
@Service
public class CategoryService {

    @Autowired private CategoryRepository repository;

    // Retorna todas las categorías registradas
    public List<CategoryDTO> findAll() {
        return repository.findAll().stream()
                .map(this::toDTO).collect(Collectors.toList());
    }

    // Crea una nueva categoría
    public CategoryDTO save(CategoryDTO dto) {
        Category c = new Category();
        c.setName(dto.getName());
        c.setDescription(dto.getDescription());
        return toDTO(repository.save(c));
    }

    // Actualiza el nombre y descripción de una categoría existente
    public CategoryDTO update(Long id, CategoryDTO dto) {
        Category c = repository.findById(id).orElseThrow();
        c.setName(dto.getName());
        c.setDescription(dto.getDescription());
        return toDTO(repository.save(c));
    }

    // Elimina una categoría por su ID
    public void delete(Long id) {
        repository.deleteById(id);
    }

    // Convierte la entidad Category a DTO
    private CategoryDTO toDTO(Category c) {
        return new CategoryDTO(c.getCategoryId(), c.getName(), c.getDescription());
    }
}
