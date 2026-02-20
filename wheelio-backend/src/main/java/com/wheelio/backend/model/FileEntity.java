package com.wheelio.backend.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "files")
@Data
@NoArgsConstructor
public class FileEntity {

    @Id
    private String id;

    private String name;
    private String contentType;
    private byte[] data;

    public FileEntity(String name, String contentType, byte[] data) {
        this.name = name;
        this.contentType = contentType;
        this.data = data;
    }
}
