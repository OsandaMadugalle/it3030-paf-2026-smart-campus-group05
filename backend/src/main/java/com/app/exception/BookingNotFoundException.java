package com.app.exception;

public class BookingNotFoundException extends BookingException {

    public BookingNotFoundException(String message) {
        super(message, "BOOKING_NOT_FOUND");
    }
}