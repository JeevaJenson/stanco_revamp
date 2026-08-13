package com.stanco.config;

import com.stanco.entity.User;
import com.stanco.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;

@Configuration
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (!userRepository.existsByEmpID("ADMIN001")) {
            User admin = new User();
            admin.setEmpID("ADMIN001");
            admin.setName("System Administrator");
            admin.setDesignation("Administrator");
            admin.setBusiness("STANCO");
            admin.setDepartment("Management");
            admin.setLobDivision("Core");
            admin.setSupervisor("ADMIN001");
            admin.setEmail("admin@stanco.com");
            admin.setMobileNo("9876543210");
            admin.setRoleType("super_admin");
            admin.setProfileStatus("Active");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setTeam("Management");
            admin.setColorCode("#2563eb");
            admin.setCreatedAt(LocalDateTime.now());
            admin.setUpdatedAt(LocalDateTime.now());

            userRepository.save(admin);
            System.out.println("Default Super Admin user initialized: empID=ADMIN001, password=admin123");
        }
    }
}
