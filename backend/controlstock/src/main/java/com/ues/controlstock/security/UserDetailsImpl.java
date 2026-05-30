package com.ues.controlstock.security;

import java.util.Collection;
import java.util.Collections;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import com.ues.controlstock.entity.AppUser;
import lombok.*;

// Adapta AppUser al formato que Spring Security necesita para autenticar
@Getter
public class UserDetailsImpl implements UserDetails {

    private final Long userId;
    private final String username;
    private final String password;
    private final Boolean status;

    // Extrae los datos del usuario desde la entidad
    public UserDetailsImpl(AppUser user) {
        this.userId   = user.getUserId();
        this.username = user.getUsername();
        this.password = user.getPasswordHash();
        this.status   = user.getStatus();
    }

    // Los roles se manejan via JWT, no via authorities
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.emptyList();
    }

    @Override public boolean isAccountNonExpired()    { return true; }
    @Override public boolean isAccountNonLocked()     { return true; }
    @Override public boolean isCredentialsNonExpired(){ return true; }

    // El usuario está activo si su status es true en la DB
    @Override public boolean isEnabled()              { return status; }
}