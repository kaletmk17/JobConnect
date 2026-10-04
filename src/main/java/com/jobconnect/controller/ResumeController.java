package com.jobconnect.controller;

import com.jobconnect.model.Application;
import com.jobconnect.model.Job;
import com.jobconnect.model.User;
import com.jobconnect.repository.ApplicationRepository;
import com.jobconnect.repository.JobRepository;
import com.jobconnect.repository.UserRepository;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("/api/resume")
public class ResumeController {

    private final UserRepository userRepository;
    private final ApplicationRepository applicationRepository;
    private final JobRepository jobRepository;

    private final String uploadDirectory =
            "uploads/resumes/";

    // Maximum resume size = 5 MB
    private static final long MAX_FILE_SIZE =
            5 * 1024 * 1024;


    public ResumeController(
            UserRepository userRepository,
            ApplicationRepository applicationRepository,
            JobRepository jobRepository) {

        this.userRepository = userRepository;
        this.applicationRepository = applicationRepository;
        this.jobRepository = jobRepository;
    }


    // =========================
    // UPLOAD RESUME
    // =========================

    @PostMapping("/upload")
    public ResponseEntity<String> uploadResume(
            @RequestParam("file") MultipartFile file) {

        try {

            User loggedInUser =
                    (User) SecurityContextHolder
                            .getContext()
                            .getAuthentication()
                            .getPrincipal();

            Long userId = loggedInUser.getId();


            // EMPTY FILE CHECK
            if (file == null || file.isEmpty()) {

                return ResponseEntity
                        .badRequest()
                        .body(
                                "Please select a resume file"
                        );
            }


            // FILE SIZE CHECK
            if (file.getSize() > MAX_FILE_SIZE) {

                return ResponseEntity
                        .badRequest()
                        .body(
                                "Resume size must be less than 5 MB"
                        );
            }


            // PDF CHECK
            if (!"application/pdf".equals(
                    file.getContentType())) {

                return ResponseEntity
                        .badRequest()
                        .body(
                                "Only PDF files are allowed"
                        );
            }


            // CREATE DIRECTORY
            Path directory =
                    Paths.get(uploadDirectory);

            Files.createDirectories(directory);


            // ORIGINAL FILE NAME
            String originalFileName =
                    file.getOriginalFilename();

            if (originalFileName == null ||
                    originalFileName.isBlank()) {

                return ResponseEntity
                        .badRequest()
                        .body(
                                "Invalid resume file name"
                        );
            }


            // CREATE SAFE FILE NAME
            String fileName =
                    userId + "_" +
                            Paths.get(
                                            originalFileName
                                    )
                                    .getFileName()
                                    .toString();


            Path filePath =
                    directory.resolve(fileName);


            // SAVE FILE
            Files.write(
                    filePath,
                    file.getBytes()
            );


            // SAVE FILE DETAILS IN USER
            loggedInUser.setResumeFileName(
                    originalFileName
            );

            loggedInUser.setResumeFilePath(
                    filePath.toString()
            );

            userRepository.save(
                    loggedInUser
            );


            return ResponseEntity.ok(
                    "Resume uploaded successfully"
            );


        } catch (IOException e) {

            e.printStackTrace();

            return ResponseEntity
                    .internalServerError()
                    .body(
                            "Failed to upload resume"
                    );
        }
    }


    // =========================
    // DOWNLOAD APPLICATION RESUME
    // =========================

    @GetMapping("/download/application/{applicationId}")
    public ResponseEntity<byte[]> downloadApplicationResume(
            @PathVariable Long applicationId) {

        // Get logged-in recruiter
        User recruiter =
                (User) SecurityContextHolder
                        .getContext()
                        .getAuthentication()
                        .getPrincipal();


        // =========================
        // FIND APPLICATION
        // =========================

        Application application =
                applicationRepository
                        .findById(applicationId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Application not found"
                                )
                        );


        // =========================
        // FIND JOB
        // =========================

        Job job =
                jobRepository
                        .findById(application.getJobId())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Job not found"
                                )
                        );


        // =========================
        // CHECK RECRUITER OWNERSHIP
        // =========================

        if (
                job.getRecruiterId() == null ||
                        recruiter.getId() == null ||
                        !job.getRecruiterId()
                                .equals(recruiter.getId())
        ) {

            return ResponseEntity
                    .status(403)
                    .build();
        }


        // =========================
        // CHECK APPLICATION RESUME
        // =========================

        if (
                application.getResumeFilePath() == null ||
                        application.getResumeFilePath().isBlank()
        ) {

            return ResponseEntity
                    .notFound()
                    .build();
        }


        try {

            Path filePath =
                    Paths.get(
                            application.getResumeFilePath()
                    );


            // =========================
            // CHECK FILE EXISTS
            // =========================

            if (!Files.exists(filePath)) {

                return ResponseEntity
                        .notFound()
                        .build();
            }


            // =========================
            // READ PDF
            // =========================

            byte[] fileBytes =
                    Files.readAllBytes(filePath);


            // =========================
            // DOWNLOAD PDF
            // =========================

            String fileName =
                    application.getResumeFileName();

            if (fileName == null ||
                    fileName.isBlank()) {

                fileName = "candidate-resume.pdf";
            }


            return ResponseEntity
                    .ok()
                    .contentType(
                            MediaType.APPLICATION_PDF
                    )
                    .header(
                            HttpHeaders.CONTENT_DISPOSITION,
                            "attachment; filename=\"" +
                                    fileName +
                                    "\""
                    )
                    .body(fileBytes);


        } catch (IOException e) {

            e.printStackTrace();

            return ResponseEntity
                    .internalServerError()
                    .build();
        }
    }
}