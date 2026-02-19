package com.wheelio.backend.service;

import com.wheelio.backend.model.User;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UserService {
    User createUser(User user);

    Optional<User> getUserById(UUID id);

    Optional<User> getUserByEmail(String email);

    List<User> getAllUsers();

    User updateUser(User user);

    void deleteUser(UUID id);

    boolean existsByEmail(String email);
}
