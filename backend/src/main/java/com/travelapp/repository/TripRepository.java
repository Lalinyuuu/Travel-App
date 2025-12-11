package com.travelapp.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.travelapp.entity.Trip;

@Repository
public interface TripRepository extends JpaRepository<Trip, Long> {
    @Query("SELECT t FROM Trip t WHERE t.authorId = :authorId")
    Page<Trip> findByAuthorId(@Param("authorId") Long authorId, Pageable pageable);

    @Query("SELECT t FROM Trip t LEFT JOIN FETCH t.author WHERE t.id = :id")
    java.util.Optional<Trip> findByIdWithAuthor(@Param("id") Long id);

    @Query(value = "SELECT * FROM trips WHERE " +
            "LOWER(title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "array_to_string(tags, ',') ILIKE CONCAT('%', :keyword, '%')", nativeQuery = true, countQuery = "SELECT COUNT(*) FROM trips WHERE "
                    +
                    "LOWER(title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
                    "array_to_string(tags, ',') ILIKE CONCAT('%', :keyword, '%')")
    Page<Trip> searchByKeyword(@Param("keyword") String keyword, Pageable pageable);
}
