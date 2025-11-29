package fakenews.backend.util;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
public class SupabaseStorageService {
    @Value("${supabase.storage.bucket}")
    String bucketName;
    @Value("${supabase.storage.endpoint_output}")
    String outputUrl;
    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMddmmssSSS");
    private final S3Client s3Client;

    public SupabaseStorageService(S3Client s3Client) {
        this.s3Client = s3Client;
    }

    public String uploadFile(MultipartFile file) throws IOException {
        String original = file.getOriginalFilename() != null ? file.getOriginalFilename() : "upload.bin";
        Path tempFile = Files.createTempFile("upload-", original);
        Files.copy(file.getInputStream(), tempFile, StandardCopyOption.REPLACE_EXISTING);

        String ext = "";
        int i = original.lastIndexOf('.');
        if (i > 0 && i < original.length() - 1) ext = original.substring(i);
        String base = original.substring(0, i > 0 ? i : original.length())
                .replaceAll("[^A-Za-z0-9._-]", "_");
        String saltFileName = LocalDateTime.now().format(formatter) + "-" + base + ext;

        String contentType = file.getContentType();
        if (contentType == null || contentType.isBlank()) {
            try { contentType = Files.probeContentType(tempFile); } catch (Exception e) { contentType = "application/octet-stream"; }
        }
        PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(saltFileName)
                .contentType(contentType)
                .build();

        s3Client.putObject(putObjectRequest, RequestBody.fromFile(tempFile));

        String url = String.format("%s/%s/%s", outputUrl, bucketName, saltFileName);
        Files.deleteIfExists(tempFile);
        return url;
    }
}
