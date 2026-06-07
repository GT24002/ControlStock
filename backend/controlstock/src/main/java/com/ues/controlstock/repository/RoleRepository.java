package com.ues.controlstock.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ues.controlstock.entity.Role;

public interface RoleRepository extends JpaRepository<Role, Long> {
    // Al llamarlo "findByRoleName", Spring Boot sabe que debe buscar por la columna "roleName"
    Optional<Role> findByRoleName(String roleName);
}
