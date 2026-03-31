package com.app.exception;

public class ConflictException extends BookingException {

    public ConflictException(String message) {
        super(message, "CONFLICT");
    }
}