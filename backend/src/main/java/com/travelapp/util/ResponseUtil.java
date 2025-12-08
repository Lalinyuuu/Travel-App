package com.travelapp.util;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;

import java.util.HashMap;
import java.util.Map;

public class ResponseUtil {
    
    public static ResponseEntity<Map<String, String>> errorResponse(String message, @NonNull HttpStatus status) {
        Map<String, String> error = new HashMap<>();
        error.put("error", message);
        return ResponseEntity.status(status).body(error);
    }
    
    public static ResponseEntity<Map<String, String>> successResponse(String message) {
        Map<String, String> response = new HashMap<>();
        response.put("message", message);
        return ResponseEntity.ok(response);
    }
}

