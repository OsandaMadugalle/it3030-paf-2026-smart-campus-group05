package com.app.controller;

import com.app.dto.RoleRequest;
import com.app.dto.UserResponse;
import com.app.model.Role;
import com.app.model.User;
import com.app.security.UserPrincipal;
import com.app.service.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class RoleController {

    @Autowired
    private RoleService roleService;

    @PostMapping("/admin/roles/assign")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponse> assignRole(@RequestBody RoleRequest request) {
        Role role = Role.valueOf(request.getRole());
        User user = roleService.assignRole(request.getUserId(), role);
        return ResponseEntity.ok(new UserResponse(user));
    }

    @PostMapping("/admin/roles/remove")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponse> removeRole(@RequestBody RoleRequest request) {
        Role role = Role.valueOf(request.getRole());
        User user = roleService.removeRole(request.getUserId(), role);
        return ResponseEntity.ok(new UserResponse(user));
    }

    @GetMapping("/admin/roles/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserResponse>> getUsersByRole(@RequestParam String role) {
        Role roleEnum = Role.valueOf(role);
        List<User> users = roleService.getUsersByRole(roleEnum);
        List<UserResponse> response = users.stream()
                .map(UserResponse::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/user/roles/me")
    public ResponseEntity<Set<String>> getMyRoles(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        Set<Role> roles = roleService.getRoles(userPrincipal.getId());
        Set<String> roleNames = roles.stream()
                .map(Role::name)
                .collect(Collectors.toSet());
        return ResponseEntity.ok(roleNames);
    }
}
