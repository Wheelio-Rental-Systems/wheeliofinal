package com.wheelio.backend.controller;

import com.wheelio.backend.model.User;
import com.wheelio.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/users")

public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/{id}")
    public ResponseEntity<User> getUser(@PathVariable UUID id) {
        return userService.getUserById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable UUID id, @RequestBody User userDetails) {
        return userService.getUserById(id)
                .map(user -> {
                    if (userDetails.getFullName() != null)
                        user.setFullName(userDetails.getFullName());
                    if (userDetails.getPhone() != null)
                        user.setPhone(userDetails.getPhone());
                    if (userDetails.getCity() != null)
                        user.setCity(userDetails.getCity());
                    if (userDetails.getAvatarUrl() != null)
                        user.setAvatarUrl(userDetails.getAvatarUrl());
                    // Add other fields as necessary

                    User updatedUser = userService.updateUser(user);
                    return ResponseEntity.ok(updatedUser);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable UUID id) {
        try {
            if (userService.getUserById(id).isPresent()) {
                userService.deleteUser(id);
                return ResponseEntity.noContent().build();
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Delete failed: " + e.getMessage());
        }
    }
}
