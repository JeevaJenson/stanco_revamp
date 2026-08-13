package com.stanco.security;

import com.stanco.entity.User;
import com.stanco.enums.Status;
import com.stanco.repository.UserRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService
        implements UserDetailsService {

    private final UserRepository userRepository;


    @Override
    public UserDetails loadUserByUsername(
            String empID)
            throws UsernameNotFoundException {


        User user =
                userRepository
                        .findByEmpID(empID)
                        .orElseThrow(() ->
                                new UsernameNotFoundException(
                                        "User not found: "
                                                + empID
                                )
                        );


        boolean enabled =
                user.getProfileStatus()
                        == Status.active;


        return new org.springframework.security
                .core.userdetails.User(

                user.getEmpID(),

                user.getPassword(),

                enabled,

                true,
                true,
                true,

                List.of(
                        new SimpleGrantedAuthority(
                                "ROLE_"
                                        + user.getRoleType()
                        )
                )
        );
    }
}