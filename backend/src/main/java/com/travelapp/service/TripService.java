package com.travelapp.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.travelapp.dto.CreateTripRequest;
import com.travelapp.dto.PageResponse;
import com.travelapp.dto.TripResponse;
import com.travelapp.dto.TripSummaryResponse;
import com.travelapp.entity.Trip;
import com.travelapp.entity.User;
import com.travelapp.repository.TripRepository;
import com.travelapp.repository.UserRepository;
import com.travelapp.security.UserPrincipal;
import com.travelapp.util.TripMapper;

@Service
public class TripService {

    private final TripRepository tripRepository;
    private final UserRepository userRepository;
    private final TranslationService translationService;

    public TripService(TripRepository tripRepository, UserRepository userRepository, TranslationService translationService) {
        this.tripRepository = tripRepository;
        this.userRepository = userRepository;
        this.translationService = translationService;
    }

    public PageResponse<TripSummaryResponse> getAllTrips(int page, int size, String query) {
        if (page < 0) {
            page = 0;
        }
        if (size < 1 || size > 100) {
            size = 12;
        }
        
        Pageable pageable = PageRequest.of(page, size);
        Page<Trip> tripsPage = (query != null && !query.trim().isEmpty())
                ? tripRepository.searchByKeyword(query.trim(), pageable)
                : tripRepository.findAll(pageable);
        
        List<TripSummaryResponse> tripSummaries = tripsPage.getContent().stream()
                .map(TripMapper::toSummary)
                .collect(Collectors.toList());
        
        return TripMapper.toPageResponse(tripsPage, tripSummaries);
    }

    public PageResponse<TripSummaryResponse> getMyTrips(int page, int size) {
        Long userId = getCurrentUserId();
        if (userId == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Please log in to view your trips");
        }

        Pageable pageable = PageRequest.of(page, size);
        Page<Trip> tripsPage = tripRepository.findByAuthorId(userId, pageable);
        
        List<TripSummaryResponse> tripSummaries = tripsPage.getContent().stream()
                .map(TripMapper::toSummary)
                .collect(Collectors.toList());
        
        return TripMapper.toPageResponse(tripsPage, tripSummaries);
    }

    public TripResponse getTripById(@NonNull Long id) {
        return tripRepository.findById(id)
                .map(TripMapper::toResponse)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Trip not found"));
    }

    @Transactional
    public TripResponse createTrip(CreateTripRequest request) {
        Long userId = getCurrentUserId();
        if (userId == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Please log in to create a trip");
        }

        User author = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        Trip trip = TripMapper.toEntity(request);
        
        // Generate translations if not provided
        if (trip.getTranslations() == null || trip.getTranslations().isEmpty()) {
            trip.setTranslations(translationService.createTranslations(
                request.getTitle(),
                request.getDescription() != null ? request.getDescription() : ""
            ));
        }
        
        trip.setAuthor(author);
        Trip savedTrip = tripRepository.save(trip);
        
        return TripMapper.toResponse(savedTrip);
    }

    @Transactional
    public TripResponse updateTrip(@NonNull Long id, CreateTripRequest request) {
        Long userId = getCurrentUserId();
        if (userId == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Please log in to edit a trip");
        }

        Trip trip = tripRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Trip not found"));

        if (!trip.getAuthorId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can only edit your own trips");
        }

        TripMapper.updateEntity(trip, request);
        
        // Update translations if not provided in request
        if (trip.getTranslations() == null || trip.getTranslations().isEmpty()) {
            trip.setTranslations(translationService.createTranslations(
                request.getTitle(),
                request.getDescription() != null ? request.getDescription() : ""
            ));
        }
        
        Trip updatedTrip = tripRepository.save(trip);
        
        return TripMapper.toResponse(updatedTrip);
    }

    @Transactional
    public void deleteTrip(@NonNull Long id) {
        Long userId = getCurrentUserId();
        if (userId == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Please log in to delete a trip");
        }

        Trip trip = tripRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Trip not found"));

        if (!trip.getAuthorId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can only delete your own trips");
        }

        tripRepository.delete(trip);
    }

    private Long getCurrentUserId() {
        return UserPrincipal.getCurrentUserId();
    }
}

