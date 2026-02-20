package com.wheelio.backend.controller;

import com.wheelio.backend.model.User;
import com.wheelio.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable String id) {
        return userService.getUserById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/role/{role}")
    public List<User> getUsersByRole(@PathVariable String role) {
        return userService.getUsersByRole(User.Role.valueOf(role.toUpperCase()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable String id, @RequestBody Map<String, String> updates) {
        return userService.getUserById(id)
                .map(user -> {
                    if (updates.containsKey("fullName"))
                        user.setFullName(updates.get("fullName"));
                    if (updates.containsKey("phone"))
                        user.setPhone(updates.get("phone"));
                    if (updates.containsKey("city"))
                        user.setCity(updates.get("city"));
                    if (updates.containsKey("avatarUrl"))
                        user.setAvatarUrl(updates.get("avatarUrl"));
                    if (updates.containsKey("role"))
                        user.setRole(User.Role.valueOf(updates.get("role").toUpperCase()));
                    return ResponseEntity.ok(userService.updateUser(user));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable String id) {
        return userService.getUserById(id)
                .map(user -> {
                    userService.deleteUser(id);
                    return ResponseEntity.ok(Map.of("message", "User deleted"));
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
