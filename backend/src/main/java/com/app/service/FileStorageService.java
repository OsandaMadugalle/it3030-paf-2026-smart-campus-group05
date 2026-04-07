package com.app.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class FileStorageService {

    @Value("${app.file.upload-dir:./uploads}")
    private String uploadDir;

    private static final List<String> ALLOWED_TYPES = List.of(
        "image/jpeg", "image/png", "image/webp", "image/jpg"
    );

    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    private static final int  MAX_FILES     = 3;

    public List<String> saveAttachments(List<MultipartFile> files) throws IOException {
        if (files == null || files.isEmpty()) return new ArrayList<>();

        if (files.size() > MAX_FILES) {
            throw new IllegalArgumentException("Maximum " + MAX_FILES + " attachments allowed");
        }

        Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
        Files.createDirectories(uploadPath);

        List<String> savedPaths = new ArrayList<>();

        for (MultipartFile file : files) {
            if (file.isEmpty()) continue;

            String contentType = file.getContentType();
            if (contentType == null || !ALLOWED_TYPES.contains(contentType)) {
                throw new IllegalArgumentException(
                    "Only JPG, PNG, and WEBP images are allowed. Got: " + contentType
                );
            }

            if (file.getSize() > MAX_FILE_SIZE) {
                throw new IllegalArgumentException(
                    "File " + file.getOriginalFilename() + " exceeds 5MB limit"
                );
            }

            String originalFilename = file.getOriginalFilename();
            String extension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }
            String uniqueFilename = UUID.randomUUID().toString() + extension;

            Path targetLocation = uploadPath.resolve(uniqueFilename);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            savedPaths.add("/uploads/" + uniqueFilename);
        }

        return savedPaths;
    }

    public void deleteFile(String filePath) {
        try {
            if (filePath == null || filePath.isBlank()) return;
            Path path = Paths.get(uploadDir)
                .toAbsolutePath()
                .normalize()
                .resolve(Paths.get(filePath).getFileName());
            Files.deleteIfExists(path);
        } catch (IOException e) {
            System.err.println("Could not delete file: " + filePath + " — " + e.getMessage());
        }
    }

    public void deleteFiles(List<String> filePaths) {
        if (filePaths == null) return;
        filePaths.forEach(this::deleteFile);
    }
}
