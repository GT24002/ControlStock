package com.ues.controlstock.repository;

import java.time.LocalDate;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.ues.controlstock.entity.Lot;

public interface LotRepository extends JpaRepository<Lot, Long> {
    List<Lot> findByProduct_ProductId(Long productId);
    List<Lot> findByExpirationDateBefore(LocalDate date);
}
