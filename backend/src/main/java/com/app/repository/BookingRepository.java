package com.app.repository;

import com.app.model.Booking;
import com.app.model.BookingStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface BookingRepository extends MongoRepository<Booking, String> {

    List<Booking> findByRequestedBy(String userId);

    List<Booking> findByStatus(BookingStatus status);

    List<Booking> findByResourceIdAndDateAndStatus(String resourceId, LocalDate date, BookingStatus status);

    List<Booking> findByResourceIdAndDate(String resourceId, LocalDate date);

    List<Booking> findByResourceId(String resourceId);

    List<Booking> findByDateBetween(LocalDate start, LocalDate end);

    List<Booking> findAllByOrderByCreatedAtDesc();

    List<Booking> findByResourceIdAndDateAndStatusIn(String resourceId, LocalDate date, List<BookingStatus> statuses);
}