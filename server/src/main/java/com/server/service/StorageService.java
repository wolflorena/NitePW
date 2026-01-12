package com.server.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.util.Base64;
import java.util.Set;
import java.util.UUID;

@Service
public class StorageService {

    private final S3Client s3;
    private final String bucket;
    private final String publicBaseUrl;

    private static final Set<String> ALLOWED_TYPES = Set.of(
            "image/png", "image/jpeg", "image/jpg", "image/webp"
    );


    public StorageService(
            S3Client s3,
            @Value("${aws.s3.bucket}") String bucket,
            @Value("${aws.s3.publicBaseUrl}") String publicBaseUrl
    ) {
        this.s3 = s3;
        this.bucket = bucket;
        this.publicBaseUrl = publicBaseUrl;
    }

    public String uploadDataUrlImage(String dataUrl, String folder) {
        if (dataUrl == null || dataUrl.isBlank()) {
            return null;
        }

        // if FE already sends URLs sometimes, just return them
        if (dataUrl.startsWith("http://") || dataUrl.startsWith("https://")) {
            return dataUrl;
        }

        // expected: data:image/png;base64,AAAA...
        if (!dataUrl.startsWith("data:") || !dataUrl.contains(";base64,")) {
            throw new IllegalArgumentException("Invalid image format (expected data URL base64).");
        }

        int comma = dataUrl.indexOf(',');
        String meta = dataUrl.substring(5, comma); // "image/png;base64"
        String base64Part = dataUrl.substring(comma + 1);

        String contentType = meta.split(";")[0]; // "image/png"
        if (!ALLOWED_TYPES.contains(contentType)) {
            throw new IllegalArgumentException("Only PNG/JPEG/WEBP allowed.");
        }

        byte[] bytes;
        try {
            bytes = Base64.getDecoder().decode(base64Part);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid base64 image data.");
        }

        if (bytes.length == 0) throw new IllegalArgumentException("Empty image data.");

        String ext = switch (contentType) {
            case "image/png" -> ".png";
            case "image/webp" -> ".webp";
            default -> ".jpg"; // jpeg/jpg
        };

        String key = folder + "/" + UUID.randomUUID() + ext;

        PutObjectRequest req = PutObjectRequest.builder()
                .bucket(bucket)
                .key(key)
                .contentType(contentType)
                .build();

        s3.putObject(req, RequestBody.fromBytes(bytes));

        return publicBaseUrl + "/" + key;
    }
}
