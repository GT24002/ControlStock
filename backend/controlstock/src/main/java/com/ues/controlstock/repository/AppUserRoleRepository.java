package com.ues.controlstock.repository;

import java.util.List;
import java.util.Optional;

import com.ues.controlstock.entity.AppUser;
import org.hibernate.annotations.SQLSelect;
import org.springframework.data.jpa.repository.JpaRepository;
import com.ues.controlstock.entity.AppUserRole;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface AppUserRoleRepository extends JpaRepository<AppUserRole, Long> {
    List<AppUserRole> findByAppUser_UserId(Long userId);
    
    @Query(value = "SELECT * FROM app_user_role WHERE role_id = ?1 AND app_user_id = ?2", nativeQuery = true)
    AppUserRole findByRoleIdAndAppUserId(Long roleId, Long appUserId);

}
