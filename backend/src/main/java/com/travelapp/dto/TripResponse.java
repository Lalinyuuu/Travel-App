package com.travelapp.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TripResponse {
    private Long id;
    private String title;
    private String description;
    private List<String> photos;
    private List<String> tags;
    private Double latitude;
    private Double longitude;
    private Long authorId;
    private String authorName;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;
}

