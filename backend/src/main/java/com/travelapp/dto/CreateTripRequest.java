package com.travelapp.dto;

import java.util.List;
import java.util.Map;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class CreateTripRequest {
    @NotBlank(message = "Title is required")
    private String title; // Thai title (default)

    private String description; // Thai description (default)

    // Translations map: {"th": {"title": "...", "description": "..."}, "en": {"title": "...", "description": "..."}}
    private Map<String, Map<String, String>> translations;

    @NotNull(message = "Photos are required")
    private List<String> photos;

    private List<String> tags;

    private Double latitude;

    private Double longitude;
}

