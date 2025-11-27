package me.crvena.bookstore.services;

import org.apache.commons.io.FilenameUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Primary;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import org.springframework.web.multipart.MultipartFile;

import lombok.RequiredArgsConstructor;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.S3Exception;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URL;
import java.util.UUID;

@Service
public interface FileStorageService {

  public String uploadFile(MultipartFile file) throws IOException;

  public void deleteFile(String fileUrl);
}

@RequiredArgsConstructor
@Service
class FileStorageServiceImpl implements FileStorageService {

  private static final Logger logger = LoggerFactory.getLogger(FileStorageService.class);

  @Autowired
  private final S3Client s3Client;

  @Value("${s3.bucket-name}")
  private String bucketName;

  @Value("${s3.endpoint}")
  private String endpoint;

  public String uploadFile(MultipartFile file) throws IOException {
    logger.info("Uploading file " + file.getOriginalFilename());
    try {
      // generate unique key
      String extension = FilenameUtils.getExtension(file.getOriginalFilename());
      String key = UUID.randomUUID().toString() + extension;

      // request to put object in the bucket
      PutObjectRequest putObjectRequest = PutObjectRequest.builder()
          .bucket(bucketName)
          .key(key)
          .contentType(file.getContentType())
          .contentLength(file.getSize())
          .build();

      // read the file into a byte array first
      // to avoid http file cannot rewind
      // otherwise, sdk will read file for checksum first
      byte[] fileBytes = file.getBytes();

      s3Client.putObject(putObjectRequest, RequestBody.fromBytes(fileBytes));

      logger.info("Successfully uploaded file {} to bucket {}", key, bucketName);

      return String.format("%s/%s/%s", endpoint, bucketName, key);

    } catch (S3Exception e) {
      logger.error("Error uploading file to S3: {}", e.getMessage(), e);
      throw new RuntimeException("Failed to upload file to S3", e);
    }
  }

  public void deleteFile(String fileUrl) {
    if (!StringUtils.hasText(fileUrl)) {
      return;
    }

    try {
      // Extract the key from the full URL.
      String key = extractKeyFromUrl(fileUrl);

      logger.info("Attempting to delete file with key: {} from bucket: {}", key, bucketName);

      DeleteObjectRequest deleteObjectRequest = DeleteObjectRequest.builder()
          .bucket(bucketName)
          .key(key)
          .build();

      s3Client.deleteObject(deleteObjectRequest);

      logger.info("Successfully deleted file {}", key);

    } catch (S3Exception e) {
      logger.error("Error while deleting file from S3: {}", e.getMessage(), e);
    } catch (Exception e) {
      logger.error("An unexpected error occurred during file deletion for URL {}: {}", fileUrl, e.getMessage());
    }
  }

  /**
   * Helper method to parse the object key from the full S3 URL
   */
  private String extractKeyFromUrl(String fileUrl) throws Exception {
    URL url = new URI(fileUrl).toURL();
    // path will be like "/bucket/key.jpg".
    // return key
    String path = url.getPath();
    String bucketPrefix = "/" + this.bucketName + "/";
    if (path.startsWith(bucketPrefix)) {
      return path.substring(bucketPrefix.length());
    }
    // fallback, removes the '/'
    return path.substring(1);
  }
}

@RequiredArgsConstructor
@Service
@Primary
class MongoFileStorageServiceImpl implements FileStorageService {

  private static final Logger logger = LoggerFactory.getLogger(MongoFileStorageServiceImpl.class);

  @Autowired
  private final RestClient client;

  @Value("${service.external.cover-api.external-url}")
  private String externalUrl;

  @Value("${service.external.cover-api.internal-url}")
  private String internalUrl;

  private String getExternalFileUri(String filename) {
    // WARN: should use some library to concat uri
    return externalUrl + filename;
  }

  public String uploadFile(MultipartFile file) throws IOException {
    logger.info("Uploading file " + file.getOriginalFilename());

    try {
      String extension = FilenameUtils.getExtension(file.getOriginalFilename());
      String filename = UUID.randomUUID().toString() + "." + extension;

      MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();

      body.add("filename", filename);
      ByteArrayResource fileResource = new ByteArrayResource(file.getBytes()) {
        @Override
        public String getFilename() {
          return file.getOriginalFilename();
        }
      };

      body.add("file", fileResource);

      client.post()
          .uri(internalUrl)
          .contentType(MediaType.MULTIPART_FORM_DATA)
          .body(body)
          .retrieve()
          .toBodilessEntity();

      logger.info("Successfully uploaded file {} to API", filename);

      // WARN: should use some library to concat uri
      return getExternalFileUri(filename);

    } catch (RestClientException e) {
      logger.error("Error uploading file to image API: {}", e.getMessage(), e);
      throw new RuntimeException("Failed to upload file to image API", e);
    }
  }

  public void deleteFile(String fileUrl) {
    if (!StringUtils.hasText(fileUrl)) {
      return;
    }

    String filename;
    try {
      var uri = new URI(fileUrl);
      filename = FilenameUtils.getName(uri.getPath());
    } catch (URISyntaxException e) {
      return;
    }

    try {

      logger.info("Attempting to delete file with url: {}", fileUrl);

      client.delete()
          .uri(getExternalFileUri(filename))
          .retrieve()
          .toBodilessEntity();

      logger.info("Successfully deleted file {}", fileUrl);

    } catch (RestClientException e) {
      logger.error("Error while deleting file: {}", e.getMessage(), e);
    } catch (Exception e) {
      logger.error("An unexpected error occurred during file deletion for URL {}: {}", fileUrl, e.getMessage());
    }
  }
}
