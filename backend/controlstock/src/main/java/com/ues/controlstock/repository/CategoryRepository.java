package com.ues.controlstock.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.ues.controlstock.entity.Category;

public interface CategoryRepository extends JpaRepository<Category, Long> {
}
