package com.app.repository;

import com.app.model.Ticket;
import com.app.model.Ticket.TicketStatus;
import com.app.model.Ticket.TicketCategory;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TicketRepository extends MongoRepository<Ticket, String> {

    List<Ticket> findByReporterIdOrderByCreatedAtDesc(String reporterId);

    List<Ticket> findByStatusOrderByCreatedAtDesc(TicketStatus status);

    List<Ticket> findByAssignedToIdOrderByCreatedAtDesc(String assignedToId);

    List<Ticket> findByResourceIdOrderByCreatedAtDesc(String resourceId);

    List<Ticket> findByCategoryOrderByCreatedAtDesc(TicketCategory category);

    List<Ticket> findByReporterIdAndStatusOrderByCreatedAtDesc(
        String reporterId, TicketStatus status
    );

    List<Ticket> findAllByOrderByCreatedAtDesc();

    @Query("{ $or: [ " +
           "  { 'title':       { $regex: ?0, $options: 'i' } }, " +
           "  { 'description': { $regex: ?0, $options: 'i' } }, " +
           "  { 'location':    { $regex: ?0, $options: 'i' } } " +
           "] }")
    List<Ticket> searchByKeyword(String keyword);

    long countByStatus(TicketStatus status);

    long countByReporterId(String reporterId);
}
