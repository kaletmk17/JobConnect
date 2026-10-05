package com.jobconnect.controller;

import com.jobconnect.model.Application;
import com.jobconnect.service.ApplicationService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    private final ApplicationService applicationService;


    public ApplicationController(
            ApplicationService applicationService) {

        this.applicationService =
                applicationService;
    }


    // =========================
    // APPLY FOR JOB WITH RESUME
    // =========================

    @PostMapping("/apply")
    public ResponseEntity<Application> applyForJob(

            @RequestParam Long jobId,

            @RequestParam("resume")
            MultipartFile resume

    ) {

        Application application =
                applicationService.applyForJob(
                        jobId,
                        resume
                );

        return ResponseEntity.ok(application);
    }


    // =========================
    // GET USER APPLICATIONS
    // =========================

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Application>>
    getUserApplications(
            @PathVariable Long userId) {

        List<Application> applications =
                applicationService
                        .getApplicationsByUser(userId);

        return ResponseEntity.ok(
                applications
        );
    }


    // =========================
    // GET JOB APPLICATIONS
    // =========================

    @GetMapping("/job/{jobId}")
    public ResponseEntity<List<Application>>
    getJobApplications(
            @PathVariable Long jobId) {

        List<Application> applications =
                applicationService
                        .getApplicationsByJob(jobId);

        return ResponseEntity.ok(
                applications
        );
    }


    // =========================
    // UPDATE APPLICATION STATUS
    // =========================

    @PutMapping("/{applicationId}/status")
    public ResponseEntity<Application>
    updateStatus(

            @PathVariable Long applicationId,

            @RequestParam String status

    ) {

        Application application =
                applicationService.updateStatus(
                        applicationId,
                        status
                );

        return ResponseEntity.ok(
                application
        );
    }
}