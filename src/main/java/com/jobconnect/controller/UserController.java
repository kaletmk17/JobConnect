package com.jobconnect.controller;

import com.jobconnect.dto.UserResponse;
import com.jobconnect.model.User;
import com.jobconnect.repository.UserRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;

    public UserController(
            UserRepository userRepository) {
        this.userRepository = userRepository;
    }


    // ==========================================
    // GET USER DETAILS BY ID
    // ==========================================

    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUserById(
            @PathVariable Long id) {

        User user =
                userRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                ));

        UserResponse response =
                new UserResponse(
                        user.getId(),
                        user.getName(),
                        user.getEmail(),
                        user.getRole()
                );

        return ResponseEntity.ok(response);
    }


    // ==========================================
    // GET MY PROFILE
    // ==========================================

    @GetMapping("/profile")
    public ResponseEntity<Map<String, Object>>
    getMyProfile() {

        User currentUser =
                (User) SecurityContextHolder
                        .getContext()
                        .getAuthentication()
                        .getPrincipal();

        User user =
                userRepository.findById(
                                currentUser.getId()
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                ));

        Map<String, Object> profile =
                new LinkedHashMap<>();

        profile.put(
                "id",
                user.getId()
        );

        profile.put(
                "name",
                user.getName()
        );

        profile.put(
                "email",
                user.getEmail()
        );

        profile.put(
                "role",
                user.getRole()
        );

        profile.put(
                "phone",
                user.getPhone()
        );

        profile.put(
                "education",
                user.getEducation()
        );

        profile.put(
                "skills",
                user.getSkills()
        );

        profile.put(
                "resumeFileName",
                user.getResumeFileName()
        );

        return ResponseEntity.ok(profile);
    }


    // ==========================================
    // UPDATE MY PROFILE
    // ==========================================

    @PutMapping("/profile")
    public ResponseEntity<Map<String, Object>>
    updateMyProfile(
            @RequestBody Map<String, String> request) {

        User currentUser =
                (User) SecurityContextHolder
                        .getContext()
                        .getAuthentication()
                        .getPrincipal();

        User user =
                userRepository.findById(
                                currentUser.getId()
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                ));


        // Update Name
        if (request.containsKey("name")) {

            user.setName(
                    request.get("name")
            );
        }


        // Update Phone
        if (request.containsKey("phone")) {

            user.setPhone(
                    request.get("phone")
            );
        }


        // Update Education
        if (request.containsKey("education")) {

            user.setEducation(
                    request.get("education")
            );
        }


        // Update Skills
        if (request.containsKey("skills")) {

            user.setSkills(
                    request.get("skills")
            );
        }


        User savedUser =
                userRepository.save(user);


        Map<String, Object> profile =
                new LinkedHashMap<>();

        profile.put(
                "id",
                savedUser.getId()
        );

        profile.put(
                "name",
                savedUser.getName()
        );

        profile.put(
                "email",
                savedUser.getEmail()
        );

        profile.put(
                "role",
                savedUser.getRole()
        );

        profile.put(
                "phone",
                savedUser.getPhone()
        );

        profile.put(
                "education",
                savedUser.getEducation()
        );

        profile.put(
                "skills",
                savedUser.getSkills()
        );

        profile.put(
                "resumeFileName",
                savedUser.getResumeFileName()
        );

        return ResponseEntity.ok(profile);
    }
}