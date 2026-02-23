package com.wheelio.backend.service;

import com.wheelio.backend.model.User;
import java.util.List;
import java.util.Optional;

public interface UserService {
    User createUser(User user);

    Optional<User> getUserById(String id);

    Optional<User> getUserByEmail(String email);

    List<User> getAllUsers();

    List<User> getUsersByRole(User.Role role);

    User updateUser(User user);

    void deleteUser(String id);

    boolean existsByEmail(String email);

    Optional<User> getUserByResetToken(String token);
}
