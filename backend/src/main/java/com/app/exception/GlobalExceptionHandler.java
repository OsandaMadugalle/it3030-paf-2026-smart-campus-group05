package com.app.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.web.servlet.resource.NoResourceFoundException;
import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(NoResourceFoundException.class)
    public ResponseEntity<Map<String, Object>> handleNoResourceFound(NoResourceFoundException ex) {
        // Log at info level as this might be common during dev
        logger.info("Resource not found: {}", ex.getResourcePath());
        
        Map<String, Object> body = new HashMap<>();
        body.put("message", "The requested resource '/" + ex.getResourcePath() + "' was not found. If this is a login attempt, please use: http://localhost:8081/oauth2/authorization/google");
        body.put("type", "NoResourceFoundException");
        body.put("status", HttpStatus.NOT_FOUND.value());
        
        return new ResponseEntity<>(body, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleAllExceptions(Exception ex) {
        logger.error("Unhandled Exception caught by GlobalExceptionHandler: ", ex);
        
        Map<String, Object> body = new HashMap<>();
        body.put("message", ex.getMessage());
        body.put("type", ex.getClass().getSimpleName());
        body.put("status", HttpStatus.INTERNAL_SERVER_ERROR.value());
        
        return new ResponseEntity<>(body, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
