package com.stanco.exception;

import com.stanco.dto.ApiResponse;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.MethodArgumentNotValidException;

import org.springframework.web.bind.annotation.*;

@RestControllerAdvice
public class GlobalExceptionHandler {


    @ExceptionHandler(
            MethodArgumentNotValidException.class
    )
    public ResponseEntity<ApiResponse>
    handleValidation(
            MethodArgumentNotValidException exception) {

        String message =
                exception
                        .getBindingResult()
                        .getFieldErrors()
                        .get(0)
                        .getDefaultMessage();

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(
                        new ApiResponse(
                                false,
                                message,
                                400
                        )
                );
    }


    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ApiResponse>
    handleRuntime(
            RuntimeException exception) {

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(
                        new ApiResponse(
                                false,
                                exception.getMessage(),
                                400
                        )
                );
    }
}