package com.app.exception;

public class UnauthorizedException extends BookingException {

    public UnauthorizedException(String message) {
        super(message, "UNAUTHORIZED");
    }
}