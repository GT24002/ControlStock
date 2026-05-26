package com.ues.controlstock.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.ues.controlstock.entity.Presentation;

public interface PresentationRepository extends JpaRepository<Presentation, Long> {
    List<Presentation> findByProduct_ProductId(Long productId);
}
