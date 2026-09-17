package com.app.service;

import com.app.model.User;
import com.app.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserById(String id) {
        return userRepository.findById(id);
    }

    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public void deleteUser(String id) {
        userRepository.deleteById(id);
    }

    public User saveUser(User user) {
        return userRepository.save(user);
    }

    public User toggleUserStatus(String id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new java.util.NoSuchElementException("User not found: " + id));
        user.setEnabled(!user.isEnabled());
        user.setUpdatedAt(java.time.LocalDateTime.now());
        return userRepository.save(user);
    }
}
