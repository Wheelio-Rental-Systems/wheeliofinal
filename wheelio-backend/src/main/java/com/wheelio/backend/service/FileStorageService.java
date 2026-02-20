package com.wheelio.backend.service;

import com.wheelio.backend.model.FileEntity;
import com.wheelio.backend.repository.FileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
public class FileStorageService {

    @Autowired
    private FileRepository fileRepository;

    public FileEntity storeFile(MultipartFile file) throws IOException {
        FileEntity entity = new FileEntity(
                file.getOriginalFilename(),
                file.getContentType(),
                file.getBytes());
        return fileRepository.save(entity);
    }

    public FileEntity getFile(String id) {
        return fileRepository.findById(id).orElse(null);
    }

    public void deleteFile(String id) {
        fileRepository.deleteById(id);
    }
}
