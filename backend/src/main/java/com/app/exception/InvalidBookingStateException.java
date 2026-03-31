package com.app.exception;

public class InvalidBookingStateException extends BookingException {

    public InvalidBookingStateException(String message) {
        super(message, "INVALID_BOOKING_STATE");
    }
}