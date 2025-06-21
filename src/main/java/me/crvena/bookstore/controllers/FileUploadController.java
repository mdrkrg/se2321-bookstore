package me.crvena.bookstore.controllers;

import me.crvena.bookstore.services.FileStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import lombok.RequiredArgsConstructor;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/files")
public class FileUploadController {

  @Autowired
  private final FileStorageService fileStorageService;

  @PostMapping("/upload")
  public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file) {
    var errorBody = new HashMap<String, String>();
    if (file.isEmpty()) {
      errorBody.put("file", "Please provide a file to upload.");
      return ResponseEntity.badRequest().body(errorBody);
    }
    try {
      String fileUrl = fileStorageService.uploadFile(file);
      return ResponseEntity.ok(Map.of("url", fileUrl));
    } catch (IOException e) {
      errorBody.put("details", "Failed to upload file: " + e.getMessage());
      return ResponseEntity.internalServerError().body(errorBody);
    }
  }
}
