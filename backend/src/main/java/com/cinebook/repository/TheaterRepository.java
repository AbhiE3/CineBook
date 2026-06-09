package com.cinebook.repository;

import com.cinebook.entity.Theater;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TheaterRepository extends JpaRepository<Theater, Long> {
    List<Theater> findByLocationIgnoreCase(String location);
}
