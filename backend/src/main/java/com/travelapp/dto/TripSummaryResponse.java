package com.travelapp.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TripSummaryResponse {
    private Long id;
    private String title;
    private String shortDescription;
    private String coverImage;
    private String province;
    private List<String> tags;
    private Long authorId;
    private OffsetDateTime updatedAt;
}

