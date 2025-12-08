package com.travelapp.controller;

import com.travelapp.dto.CreateTripRequest;
import com.travelapp.dto.PageResponse;
import com.travelapp.dto.TripResponse;
import com.travelapp.dto.TripSummaryResponse;
import com.travelapp.service.TripService;
import com.travelapp.util.ResponseUtil;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/trips")
public class TripController {

    private final TripService tripService;

    public TripController(TripService tripService) {
        this.tripService = tripService;
    }

    @GetMapping
    public ResponseEntity<PageResponse<TripSummaryResponse>> getAllTrips(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(required = false) String query) {
        return ResponseEntity.ok(tripService.getAllTrips(page, size, query));
    }

    @GetMapping("/mine")
    public ResponseEntity<PageResponse<TripSummaryResponse>> getMyTrips(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        return ResponseEntity.ok(tripService.getMyTrips(page, size));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TripResponse> getTripById(@PathVariable @NonNull Long id) {
        return ResponseEntity.ok(tripService.getTripById(id));
    }

    @PostMapping
    public ResponseEntity<TripResponse> createTrip(@Valid @RequestBody CreateTripRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(tripService.createTrip(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TripResponse> updateTrip(@PathVariable @NonNull Long id, @Valid @RequestBody CreateTripRequest request) {
        return ResponseEntity.ok(tripService.updateTrip(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTrip(@PathVariable @NonNull Long id) {
        tripService.deleteTrip(id);
        return ResponseUtil.successResponse("Trip deleted successfully");
    }
}

