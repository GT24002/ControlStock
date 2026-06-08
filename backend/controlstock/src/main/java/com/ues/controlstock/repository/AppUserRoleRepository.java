package com.ues.controlstock.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.ues.controlstock.entity.AppUserRole;

public interface AppUserRoleRepository extends JpaRepository<AppUserRole, Long> {
    List<AppUserRole> findByAppUser_UserId(Long userId);
    List<AppUserRole> findByRole_RoleId(Long roleId);
}
