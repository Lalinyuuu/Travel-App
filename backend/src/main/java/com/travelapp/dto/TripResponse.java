package com.travelapp.dto;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Map;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TripResponse {
    private Long id;
    private String title; // Default/Thai title (for backward compatibility)
    private String description; // Default/Thai description (for backward compatibility)
    private Map<String, Map<String, String>> translations; // Multilingual content
    private List<String> photos;
    private List<String> tags;
    private Double latitude;
    private Double longitude;
    private Long authorId;
    private String authorName;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;
}

