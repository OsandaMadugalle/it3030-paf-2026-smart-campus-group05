package com.app.dto;

import com.app.model.Role;
import com.app.model.User;

import java.util.Collections;
import java.util.Set;
import java.util.stream.Collectors;

public class UserResponse {
    private String id;
    private String email;
    private String name;
    private Set<String> roles;
    private String avatarUrl;
    private String provider;
    private boolean enabled;
    private java.time.LocalDateTime createdAt;

    public UserResponse() {}

    public UserResponse(User user) {
        this.id = user.getId();
        this.email = user.getEmail();
        this.name = user.getName();
        this.roles = user.getRoles() == null
            ? Collections.emptySet()
            : user.getRoles().stream()
                .filter(java.util.Objects::nonNull)
                .map(Role::name)
                .collect(Collectors.toSet());
        this.avatarUrl = user.getAvatarUrl();
        this.provider = user.getProvider();
        this.enabled = user.isEnabled();
        this.createdAt = user.getCreatedAt() != null ? user.getCreatedAt() : java.time.LocalDateTime.now();
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Set<String> getRoles() {
        return roles;
    }

    public void setRoles(Set<String> roles) {
        this.roles = roles;
    }

    public String getAvatarUrl() {
        return avatarUrl;
    }

    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }

    public String getProvider() {
        return provider;
    }

    public void setProvider(String provider) {
        this.provider = provider;
    }

    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    public java.time.LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(java.time.LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
