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
public class TripSummaryResponse {
    private Long id;
    private String title;
    private String shortDescription;
    private Map<String, Map<String, String>> translations;
    private String coverImage;
    private String province;
    private List<String> tags;
    private Long authorId;
    private OffsetDateTime updatedAt;
}

