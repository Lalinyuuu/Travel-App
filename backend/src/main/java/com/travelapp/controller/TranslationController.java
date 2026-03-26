package com.travelapp.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.travelapp.service.TripTranslationService;
import com.travelapp.util.ResponseUtil;

@RestController
@RequestMapping("/api/admin/translations")
public class TranslationController {

    private final TripTranslationService tripTranslationService;

    public TranslationController(TripTranslationService tripTranslationService) {
        this.tripTranslationService = tripTranslationService;
    }

    /**
     * Translate all trips that don't have translations
     * POST /api/admin/translations/translate-all
     */
    @PostMapping("/translate-all")
    public ResponseEntity<?> translateAllTrips() {
        try {
            // Don't allow running translation jobs when Google API key is missing.
            // This prevents unnecessary DB writes and any accidental external calls.
            if (!tripTranslationService.isGoogleTranslateConfigured()) {
                return ResponseUtil.errorResponse(
                    "Google Translate is not configured on the server (missing GOOGLE_TRANSLATE_API_KEY).",
                    org.springframework.http.HttpStatus.SERVICE_UNAVAILABLE
                );
            }
            int count = tripTranslationService.translateAllTrips();
            return ResponseUtil.successResponse(
                String.format("Successfully translated %d trips", count)
            );
        } catch (Exception e) {
            return ResponseUtil.errorResponse(
                "Error translating trips: " + e.getMessage(),
                org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    /**
     * Translate a specific trip by ID
     * POST /api/admin/translations/translate/{tripId}
     */
    @PostMapping("/translate/{tripId}")
    public ResponseEntity<?> translateTrip(@PathVariable Long tripId) {
        try {
            if (!tripTranslationService.isGoogleTranslateConfigured()) {
                return ResponseUtil.errorResponse(
                    "Google Translate is not configured on the server (missing GOOGLE_TRANSLATE_API_KEY).",
                    org.springframework.http.HttpStatus.SERVICE_UNAVAILABLE
                );
            }
            boolean success = tripTranslationService.translateTrip(tripId);
            if (success) {
                return ResponseUtil.successResponse("Trip translated successfully");
            } else {
                return ResponseUtil.errorResponse(
                    "Trip not found or translation failed",
                    org.springframework.http.HttpStatus.NOT_FOUND
                );
            }
        } catch (Exception e) {
            return ResponseUtil.errorResponse(
                "Error translating trip: " + e.getMessage(),
                org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}

