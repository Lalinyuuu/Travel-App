package com.travelapp.repository;

import com.travelapp.entity.Trip;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface TripRepository extends JpaRepository<Trip, Long> {
    @Query("SELECT t FROM Trip t WHERE t.authorId = :authorId")
    Page<Trip> findByAuthorId(@Param("authorId") Long authorId, Pageable pageable);
    
    @Query(value = "SELECT * FROM trips WHERE " +
           "LOWER(title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "EXISTS (SELECT 1 FROM unnest(tags) AS tag WHERE LOWER(tag::text) LIKE LOWER(CONCAT('%', :keyword, '%')))",
           nativeQuery = true,
           countQuery = "SELECT COUNT(*) FROM trips WHERE " +
           "LOWER(title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "EXISTS (SELECT 1 FROM unnest(tags) AS tag WHERE LOWER(tag::text) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Trip> searchByKeyword(@Param("keyword") String keyword, Pageable pageable);
}

