package com.wheelio.backend.controller;

import com.wheelio.backend.model.FileEntity;
import com.wheelio.backend.service.FileStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/files")
public class FileController {

    private static final org.slf4j.Logger logger = org.slf4j.LoggerFactory.getLogger(FileController.class);

    @Autowired
    private FileStorageService fileStorageService;

    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file) {
        try {
            String fileId = fileStorageService.storeFile(file);
            logger.info("Uploaded file ID: {}", fileId);
            Map<String, String> response = new HashMap<>();
            response.put("fileId", fileId);
            response.put("message", "File uploaded successfully");
            return ResponseEntity.ok(response);
        } catch (IOException e) {
            return ResponseEntity.badRequest().body("Could not upload file: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Resource> downloadFile(@PathVariable String id) {
        try {
            FileEntity fileEntity = fileStorageService.getFile(id);
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(fileEntity.getContentType()))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileEntity.getName() + "\"")
                    .body(new ByteArrayResource(fileEntity.getData()));
        } catch (FileNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
