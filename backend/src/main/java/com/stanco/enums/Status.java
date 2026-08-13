package com.stanco.enums;

public enum Status {

    active("01"),
    inactive("02");

    private final String code;

    Status(String code) {
        this.code = code;
    }

    public String getCode() {
        return code;
    }
}