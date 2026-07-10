package com.example.ai.Cloudnairy;

import com.cloudinary.Cloudinary;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class CloudService {

    private static final long MAX_FILE_SIZE = 2 * 1024 * 1024;

    private static final List<String> ALLOWED_MIME_TYPES = List.of(
            "image/jpeg",
            "image/png",
            "image/jpg"
    );

    private static final List<String> ALLOWED_EXTENSIONS = List.of(
            "jpg", "jpeg", "png"
    );

    private final Cloudinary cloudinary;

    public String uploadImage(MultipartFile file) {

        System.out.println("Cloud Upload Started");

        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File is empty");
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new IllegalArgumentException("File exceeds 2MB");
        }

        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_MIME_TYPES.contains(contentType)) {
            throw new IllegalArgumentException("Invalid file type");
        }

        String filename = Objects.requireNonNull(file.getOriginalFilename());
        String extension = getExtension(filename);

        if (!ALLOWED_EXTENSIONS.contains(extension)) {
            throw new IllegalArgumentException("Invalid file extension");
        }

        try {

            Map<?, ?> uploadResult = cloudinary.uploader().upload(
                    file.getBytes(),
                    Map.of("resource_type", "image",
                            "folder", "student_faces")
            );

            System.out.println("Cloud Upload Success");

            Object secureUrl = uploadResult.get("secure_url");
            if (secureUrl == null) {
                throw new RuntimeException("Cloud upload failed");
            }

            return secureUrl.toString();

        } catch (Exception e) {
            System.out.println("Cloud Upload Failed");
            e.printStackTrace();
            throw new RuntimeException("Cloud upload failed", e);
        }
    }

    private String getExtension(String filename) {
        int dot = filename.lastIndexOf(".");
        if (dot < 0) return "";
        return filename.substring(dot + 1).toLowerCase();
    }
}
