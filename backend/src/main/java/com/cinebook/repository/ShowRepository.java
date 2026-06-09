package com.cinebook.repository;

import com.cinebook.entity.Show;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ShowRepository extends JpaRepository<Show, Long> {
    List<Show> findByDeletedFalse();
    List<Show> findByMovieIdAndDeletedFalse(Long movieId);
    List<Show> findByTheaterIdAndDeletedFalse(Long theaterId);
}
