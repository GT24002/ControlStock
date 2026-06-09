package com.ues.controlstock.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.ues.controlstock.entity.Permission;

public interface PermissionRepository extends JpaRepository<Permission, Long> {
}
