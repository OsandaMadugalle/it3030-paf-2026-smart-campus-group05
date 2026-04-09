package com.app.service;

import com.app.model.Role;
import com.app.model.User;
import com.app.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Service
public class RoleService {

    @Autowired
    private UserRepository userRepository;

    public User assignRole(String userId, Role role) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        // When assigning a new role, we want to replace existing roles 
        // to ensure a user only has one active role at a time
        user.getRoles().clear();
        user.getRoles().add(role);
        user.setUpdatedAt(LocalDateTime.now());
        return userRepository.save(user);
    }

    public User removeRole(String userId, Role role) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        // If we remove a role, and it's their only role, we should reset them to ROLE_USER
        // instead of leaving them with no roles, or throw an error if already ROLE_USER
        if (role == Role.ROLE_USER) {
            throw new RuntimeException("Cannot remove the base USER role. Assign a different role instead to replace it.");
        }

        user.getRoles().clear();
        user.getRoles().add(Role.ROLE_USER);
        user.setUpdatedAt(LocalDateTime.now());
        return userRepository.save(user);
    }

    public List<User> getUsersByRole(Role role) {
        return userRepository.findByRoles(role);
    }

    public Set<Role> getRoles(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        return user.getRoles();
    }
}
