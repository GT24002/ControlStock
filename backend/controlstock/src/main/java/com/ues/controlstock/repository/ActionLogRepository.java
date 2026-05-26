package com.ues.controlstock.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.ues.controlstock.entity.ActionLog;

public interface ActionLogRepository extends JpaRepository<ActionLog, Long> {
    List<ActionLog> findByAppUser_UserId(Long userId);
}
