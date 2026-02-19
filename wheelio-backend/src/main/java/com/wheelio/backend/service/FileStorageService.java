package com.wheelio.backend.service;

import com.wheelio.backend.model.FileEntity;
import com.wheelio.backend.repository.FileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.Objects;

@Service
public class FileStorageService {

    @Autowired
    private FileRepository fileRepository;

    public String storeFile(MultipartFile file) throws IOException {
        String fileName = StringUtils.cleanPath(Objects.requireNonNull(file.getOriginalFilename()));

        // Check for invalid path sequence
        if (fileName.contains("..")) {
            throw new IOException("Filename contains invalid path sequence " + fileName);
        }

        FileEntity fileEntity = new FileEntity(fileName, file.getContentType(), file.getBytes());
        return fileRepository.save(fileEntity).getId();
    }

    public FileEntity getFile(String id) throws FileNotFoundException {
        return fileRepository.findById(id)
                .orElseThrow(() -> new FileNotFoundException("File not found with id " + id));
    }
}
