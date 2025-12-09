package com.travelapp.util;

import java.util.List;

import org.springframework.data.domain.Page;

import com.travelapp.dto.CreateTripRequest;
import com.travelapp.dto.PageResponse;
import com.travelapp.dto.TripResponse;
import com.travelapp.dto.TripSummaryResponse;
import com.travelapp.entity.Trip;

public class TripMapper {
    
    private static final String[] PROVINCES = {
        "กรุงเทพมหานคร", "เชียงใหม่", "ชลบุรี", "ตราด", "กาญจนบุรี",
        "สตูล", "ภูเก็ต", "พังงา", "กระบี่", "ระยอง"
    };
    
    private static final int MAX_DESCRIPTION_LENGTH = 120;
    
    public static Trip toEntity(CreateTripRequest request) {
        Trip trip = new Trip();
        trip.setTitle(request.getTitle());
        trip.setDescription(request.getDescription());
        
        // Set translations if provided, otherwise will be set by service
        if (request.getTranslations() != null && !request.getTranslations().isEmpty()) {
            trip.setTranslations(request.getTranslations());
        }
        
        trip.setPhotos(request.getPhotos() != null ? request.getPhotos() : List.of());
        trip.setTags(request.getTags() != null ? request.getTags() : List.of());
        trip.setLatitude(request.getLatitude());
        trip.setLongitude(request.getLongitude());
        return trip;
    }
    
    public static void updateEntity(Trip trip, CreateTripRequest request) {
        trip.setTitle(request.getTitle());
        trip.setDescription(request.getDescription());
        
        // Update translations if provided
        if (request.getTranslations() != null && !request.getTranslations().isEmpty()) {
            trip.setTranslations(request.getTranslations());
        }
        
        trip.setPhotos(request.getPhotos() != null ? request.getPhotos() : List.of());
        trip.setTags(request.getTags() != null ? request.getTags() : List.of());
        trip.setLatitude(request.getLatitude());
        trip.setLongitude(request.getLongitude());
    }
    
    public static TripResponse toResponse(Trip trip) {
        TripResponse response = new TripResponse();
        response.setId(trip.getId());
        response.setTitle(trip.getTitle());
        response.setDescription(trip.getDescription());
        
        // Include translations if available
        if (trip.getTranslations() != null && !trip.getTranslations().isEmpty()) {
            response.setTranslations(trip.getTranslations());
        }
        
        response.setPhotos(trip.getPhotos());
        response.setTags(trip.getTags());
        response.setLatitude(trip.getLatitude());
        response.setLongitude(trip.getLongitude());
        response.setAuthorId(trip.getAuthorId());
        
        // Safely get author name, handle lazy loading exception
        try {
            response.setAuthorName(trip.getAuthor() != null ? trip.getAuthor().getDisplayName() : null);
        } catch (Exception e) {
            // If lazy loading fails, set to null
            response.setAuthorName(null);
        }
        
        response.setCreatedAt(trip.getCreatedAt());
        response.setUpdatedAt(trip.getUpdatedAt());
        return response;
    }
    
    public static TripSummaryResponse toSummary(Trip trip) {
        TripSummaryResponse summary = new TripSummaryResponse();
        summary.setId(trip.getId());
        summary.setTitle(trip.getTitle());
        summary.setShortDescription(truncateDescription(trip.getDescription()));
        
        // Include translations if available
        if (trip.getTranslations() != null && !trip.getTranslations().isEmpty()) {
            summary.setTranslations(trip.getTranslations());
        }
        
        summary.setCoverImage(getCoverImage(trip.getPhotos()));
        summary.setProvince(extractProvince(trip.getTags()));
        summary.setTags(trip.getTags());
        summary.setAuthorId(trip.getAuthorId());
        summary.setUpdatedAt(trip.getUpdatedAt());
        return summary;
    }
    
    public static <T> PageResponse<T> toPageResponse(Page<?> page, List<T> content) {
        return new PageResponse<>(
            content,
            page.getNumber(),
            page.getSize(),
            page.getTotalElements(),
            page.getTotalPages()
        );
    }
    
    private static String truncateDescription(String description) {
        if (description == null) {
            return "";
        }
        if (description.length() > MAX_DESCRIPTION_LENGTH) {
            return description.substring(0, MAX_DESCRIPTION_LENGTH) + "...";
        }
        return description;
    }
    
    private static String getCoverImage(List<String> photos) {
        return photos != null && !photos.isEmpty() ? photos.get(0) : "";
    }
    
    private static String extractProvince(List<String> tags) {
        if (tags == null || tags.isEmpty()) {
            return "";
        }
        
        for (String tag : tags) {
            for (String province : PROVINCES) {
                if (tag.contains(province)) {
                    return province;
                }
            }
        }
        
        return tags.get(0);
    }
}

