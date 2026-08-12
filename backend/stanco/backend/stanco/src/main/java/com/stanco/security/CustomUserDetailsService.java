package com.stanco.security;

import com.stanco.entity.User;
import com.stanco.repository.UserRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService
        implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(
            String empID)
            throws UsernameNotFoundException {

        User user = userRepository
                .findByEmpID(empID)
                .orElseThrow(() ->
                        new UsernameNotFoundException(
                                "Employee not found: " + empID
                        )
                );

        return org.springframework.security.core.userdetails.User
                .withUsername(user.getEmpID())
                .password(user.getPassword())
                .roles(user.getRoleType())
                .disabled(
                        !"Active".equalsIgnoreCase(
                                user.getProfileStatus()
                        )
                )
                .build();
    }
}