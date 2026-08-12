package com.stanco.enums;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter
public class StatusConverter
        implements AttributeConverter<Status, String> {

    @Override
    public String convertToDatabaseColumn(
            Status status) {

        if (status == null) {
            return null;
        }

        return status.getCode();
    }

    @Override
    public Status convertToEntityAttribute(
            String code) {

        if (code == null) {
            return null;
        }

        if ("01".equals(code)) {
            return Status.active;
        }

        if ("02".equals(code)) {
            return Status.inactive;
        }

        throw new IllegalArgumentException(
                "Invalid status code: " + code
        );
    }
}