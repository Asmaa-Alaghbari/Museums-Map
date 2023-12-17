package com.example.backendmap.repository;

import com.example.backendmap.entity.Point;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PointRepository extends JpaRepository<Point, Integer> {
    Optional<Point> findByLatitudeAndLongitude(Float latitude, Float longitude);

    Point findByName(String name);
}
