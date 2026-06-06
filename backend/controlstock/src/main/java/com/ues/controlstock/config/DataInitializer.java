package com.ues.controlstock.config;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.ues.controlstock.entity.AppUser;
import com.ues.controlstock.entity.AppUserRole;
import com.ues.controlstock.entity.Role;
import com.ues.controlstock.repository.AppUserRepository;
import com.ues.controlstock.repository.AppUserRoleRepository;
import com.ues.controlstock.repository.RoleRepository;

// Inicializa datos por defecto de la aplicación al arrancar
@Component
public class DataInitializer implements CommandLineRunner {
    
    @Autowired private RoleRepository roleRepository;
    @Autowired private AppUserRepository appUserRepository;
    @Autowired private AppUserRoleRepository appUserRoleRepository;
    @Autowired private PasswordEncoder passwordEncoder;

    @Override
@Transactional
public void run(String... args) throws Exception {
    // 1. Volvemos al código original: Crear rol "admin" si no existe
    Role adminRole = roleRepository.findByRoleName("admin").orElseGet(() -> {
        Role role = new Role();
        role.setRoleName("admin");
        role.setDescription("Full access");
        return roleRepository.save(role);
    });

    // 2. Buscar al usuario 'admin' (si no existe, prepara uno nuevo)
    AppUser adminUser = appUserRepository.findByUsername("admin").orElseGet(() -> {
        AppUser newUser = new AppUser();
        newUser.setUsername("admin");
        return newUser;
    });

    // 3. Mantenemos los datos correctos para que no falle el login
    adminUser.setName("Administrador");
    adminUser.setLastname("Sistema");
    adminUser.setEmail("admin@controlstock.com");
    adminUser.setPasswordHash(passwordEncoder.encode("admin123")); 
    adminUser.setStatus(true);
    
    // Guardamos (hace un UPDATE automático sin romper tus otras tablas)
    adminUser = appUserRepository.save(adminUser);

    // 4. Le asignamos el rol "admin" original
    try {
        AppUserRole userRole = new AppUserRole();
        userRole.setAppUser(adminUser);
        userRole.setRole(adminRole);
        appUserRoleRepository.save(userRole);
    } catch (Exception e) {
        // Ignoramos el error si el usuario ya tenía el rol "admin" asignado de antes
        System.out.println("Nota: El usuario ya tiene el rol admin asignado.");
    }
}

}
