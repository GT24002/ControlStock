package com.ues.controlstock.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ues.controlstock.entity.Role;

public interface RoleRepository extends JpaRepository<Role, Long> {
    
}
