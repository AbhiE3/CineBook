package com.cinebook.repository;

import com.cinebook.entity.MovieInterest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MovieInterestRepository extends JpaRepository<MovieInterest, Long> {
    Optional<MovieInterest> findByMovieIdAndUserId(Long movieId, Long userId);
    long countByMovieId(Long movieId);
}
