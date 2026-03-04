package com.app.controller;

<<<<<<< HEAD
import com.app.dto.UserResponse;
import com.app.model.User;
import com.app.security.UserPrincipal;
import com.app.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
=======
import com.app.model.User;
import com.app.repository.UserRepository;
import com.app.security.UserPrincipal;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
>>>>>>> develop

@RestController
@RequestMapping("/api/user")
public class UserController {

<<<<<<< HEAD
    @Autowired
    private UserService userService;

    @GetMapping("/me")
    public ResponseEntity<UserResponse> getCurrentUser(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        return userService.getUserById(userPrincipal.getId())
                .map(user -> ResponseEntity.ok(new UserResponse(user)))
                .orElse(ResponseEntity.notFound().build());
    }
}
=======
    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/me")
    public User getCurrentUser(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        System.out.println("DEBUG: Entering getCurrentUser. Principal: " + (userPrincipal == null ? "NULL" : userPrincipal.getEmail()));
        
        if (userPrincipal == null) {
            System.err.println("DEBUG: UserPrincipal is NULL - throwing 401");
            throw new RuntimeException("Unauthorized: No user principal found");
        }
        
        return userRepository.findById(userPrincipal.getId())
                .map(user -> {
                    System.out.println("DEBUG: Found user in DB: " + user.getEmail());
                    return user;
                })
                .orElseThrow(() -> {
                    logger.error("User not found in database with id: {}", userPrincipal.getId());
                    return new RuntimeException("User not found in database with id: " + userPrincipal.getId());
                });
    }
}
>>>>>>> develop
