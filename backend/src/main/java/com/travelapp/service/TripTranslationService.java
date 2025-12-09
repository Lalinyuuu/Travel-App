package com.travelapp.service;

import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.travelapp.entity.Trip;
import com.travelapp.repository.TripRepository;

/**
 * Service to translate existing trips in the database
 */
@Service
public class TripTranslationService {

    private static final Logger logger = LoggerFactory.getLogger(TripTranslationService.class);

    private final TripRepository tripRepository;
    private final TranslationService translationService;

    public TripTranslationService(TripRepository tripRepository, TranslationService translationService) {
        this.tripRepository = tripRepository;
        this.translationService = translationService;
    }

    /**
     * Translate all trips that don't have translations yet
     */
    @Transactional
    public int translateAllTrips() {
        List<Trip> trips = tripRepository.findAll();
        int translatedCount = 0;
        int skippedCount = 0;
        int errorCount = 0;

        logger.info("Starting translation for {} trips...", trips.size());

        for (Trip trip : trips) {
            try {
                // Skip if already has valid translations (not empty)
                if (trip.getTranslations() != null && !trip.getTranslations().isEmpty()) {
                    // Check if English translation exists and is not empty
                    Map<String, String> enTranslations = trip.getTranslations().get("en");
                    if (enTranslations != null && 
                        enTranslations.containsKey("title") &&
                        !enTranslations.get("title").trim().isEmpty() &&
                        !enTranslations.get("title").equals(trip.getTitle())) {
                        // Has valid English translation (not empty and different from Thai title)
                        skippedCount++;
                        continue;
                    }
                }

                // Create translations
                Map<String, Map<String, String>> translations = translationService.createTranslations(
                    trip.getTitle() != null ? trip.getTitle() : "",
                    trip.getDescription() != null ? trip.getDescription() : ""
                );

                trip.setTranslations(translations);
                tripRepository.save(trip);
                translatedCount++;

                if (translatedCount % 10 == 0) {
                    logger.info("Translated {} trips so far...", translatedCount);
                }
            } catch (Exception e) {
                logger.error("Error translating trip ID {}: {}", trip.getId(), e.getMessage());
                errorCount++;
            }
        }

        logger.info("Translation completed: {} translated, {} skipped, {} errors", 
            translatedCount, skippedCount, errorCount);

        return translatedCount;
    }

    /**
     * Translate a single trip by ID
     */
    @Transactional
    public boolean translateTrip(Long tripId) {
        if (tripId == null) {
            return false;
        }
        return tripRepository.findById(tripId)
            .map(trip -> {
                try {
                    Map<String, Map<String, String>> translations = translationService.createTranslations(
                        trip.getTitle() != null ? trip.getTitle() : "",
                        trip.getDescription() != null ? trip.getDescription() : ""
                    );
                    trip.setTranslations(translations);
                    tripRepository.save(trip);
                    logger.info("Translated trip ID: {}", tripId);
                    return true;
                } catch (Exception e) {
                    logger.error("Error translating trip ID {}: {}", tripId, e.getMessage());
                    return false;
                }
            })
            .orElse(false);
    }
}

