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

        user.getRoles().add(role);
        user.setUpdatedAt(LocalDateTime.now());
        return userRepository.save(user);
    }

    public User removeRole(String userId, Role role) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        // Prevent removing the last role
        if (user.getRoles().size() <= 1 && user.getRoles().contains(role)) {
            throw new RuntimeException("Cannot remove the last role from user");
        }

        user.getRoles().remove(role);
        user.setUpdatedAt(LocalDateTime.now());
        return userRepository.save(user);
    }

    public List<User> getUsersByRole(Role role) {
        return userRepository.findByRolesContaining(role);
    }

    public Set<Role> getRoles(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        return user.getRoles();
    }
}
