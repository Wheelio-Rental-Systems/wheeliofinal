package com.wheelio.backend.service.impl;

import com.wheelio.backend.model.User;
import com.wheelio.backend.repository.UserRepository;
import com.wheelio.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final com.wheelio.backend.repository.DriverProfileRepository driverProfileRepository;

    @Autowired
    public UserServiceImpl(UserRepository userRepository,
            com.wheelio.backend.repository.DriverProfileRepository driverProfileRepository) {
        this.userRepository = userRepository;
        this.driverProfileRepository = driverProfileRepository;
    }

    @Override
    public User createUser(User user) {
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        return userRepository.save(user);
    }

    @Override
    public Optional<User> getUserById(UUID id) {
        return userRepository.findById(id);
    }

    @Override
    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public User updateUser(User user) {
        user.setUpdatedAt(LocalDateTime.now());
        return userRepository.save(user);
    }

    @Override
    public void deleteUser(UUID id) {
        try {
            if (driverProfileRepository.existsById(id)) {
                driverProfileRepository.deleteById(id);
                driverProfileRepository.flush(); // Force execution
            }
            userRepository.deleteById(id);
        } catch (Exception e) {
            // Log the error (optional, but good for debugging if we could see logs)
            // Throwing RuntimeException with details to appear in API response
            throw new RuntimeException("Delete failed: " + e.getMessage());
        }
    }

    @Override
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }
}
