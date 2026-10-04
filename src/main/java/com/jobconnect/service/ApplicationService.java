package com.jobconnect.service;

import com.jobconnect.exception.DuplicateApplicationException;
import com.jobconnect.model.Application;
import com.jobconnect.model.Job;
import com.jobconnect.model.User;
import com.jobconnect.repository.ApplicationRepository;
import com.jobconnect.repository.JobRepository;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@Service
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final JobRepository jobRepository;


    public ApplicationService(
            ApplicationRepository applicationRepository,
            JobRepository jobRepository
    ) {

        this.applicationRepository =
                applicationRepository;

        this.jobRepository =
                jobRepository;
    }


    // =========================
    // APPLY FOR JOB WITH RESUME
    // =========================

    public Application applyForJob(
            Long jobId,
            MultipartFile resume
    ) {

        User user = (User) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();

        Long userId = user.getId();


        // =========================
        // RESUME EMPTY CHECK
        // =========================

        if (resume == null || resume.isEmpty()) {

            throw new RuntimeException(
                    "Please select your resume"
            );
        }


        // =========================
        // RESUME SIZE CHECK
        // Maximum 5 MB
        // =========================

        if (resume.getSize() > 5 * 1024 * 1024) {

            throw new RuntimeException(
                    "Resume size must be less than 5 MB"
            );
        }


        // =========================
        // PDF CHECK
        // =========================

        if (!"application/pdf".equals(
                resume.getContentType()
        )) {

            throw new RuntimeException(
                    "Only PDF files are allowed"
            );
        }


        // =========================
        // DUPLICATE APPLICATION CHECK
        // =========================

        if (applicationRepository
                .existsByJobIdAndUserId(
                        jobId,
                        userId
                )) {

            throw new DuplicateApplicationException(
                    "You have already applied for this job"
            );
        }


        try {

            // =========================
            // CREATE APPLICATION RESUME DIRECTORY
            // =========================

            Path directory =
                    Paths.get(
                            "uploads/applications/"
                    );

            Files.createDirectories(
                    directory
            );


            // =========================
            // GET ORIGINAL FILE NAME
            // =========================

            String originalFileName =
                    resume.getOriginalFilename();

            if (
                    originalFileName == null ||
                            originalFileName.isBlank()
            ) {

                throw new RuntimeException(
                        "Invalid resume file name"
                );
            }


            // =========================
            // CREATE SAFE FILE NAME
            // =========================

            String safeFileName =
                    Paths.get(
                                    originalFileName
                            )
                            .getFileName()
                            .toString();


            String fileName =
                    userId +
                            "_" +
                            jobId +
                            "_" +
                            System.currentTimeMillis() +
                            "_" +
                            safeFileName;


            Path filePath =
                    directory.resolve(
                            fileName
                    );


            // =========================
            // SAVE RESUME FILE
            // =========================

            Files.write(
                    filePath,
                    resume.getBytes()
            );


            // =========================
            // CREATE APPLICATION
            // =========================

            Application application =
                    new Application(
                            jobId,
                            userId,
                            "PENDING"
                    );


            // =========================
            // SAVE RESUME DETAILS
            // =========================

            application.setResumeFileName(
                    originalFileName
            );

            application.setResumeFilePath(
                    filePath.toString()
            );


            // =========================
            // SAVE APPLICATION
            // =========================

            return applicationRepository.save(
                    application
            );


        } catch (IOException e) {

            throw new RuntimeException(
                    "Failed to save resume",
                    e
            );
        }
    }


    // =========================
    // GET USER APPLICATIONS
    // =========================

    public List<Application> getApplicationsByUser(
            Long userId
    ) {

        User loggedInUser =
                (User) SecurityContextHolder
                        .getContext()
                        .getAuthentication()
                        .getPrincipal();


        // User can only see their own applications
        if (
                loggedInUser.getId() == null ||
                        !loggedInUser.getId().equals(userId)
        ) {

            throw new RuntimeException(
                    "You can only view your own applications"
            );
        }


        return applicationRepository
                .findByUserId(userId);
    }


    // =========================
    // GET JOB APPLICATIONS
    // =========================

    public List<Application> getApplicationsByJob(
            Long jobId
    ) {

        User recruiter =
                (User) SecurityContextHolder
                        .getContext()
                        .getAuthentication()
                        .getPrincipal();


        // Find job
        Job job =
                jobRepository
                        .findById(jobId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Job not found"
                                )
                        );


        // Check recruiter ownership
        if (
                job.getRecruiterId() == null ||
                        recruiter.getId() == null ||
                        !job.getRecruiterId()
                                .equals(recruiter.getId())
        ) {

            throw new RuntimeException(
                    "You can only view applications for your own jobs"
            );
        }


        return applicationRepository
                .findByJobId(jobId);
    }


    // =========================
    // UPDATE APPLICATION STATUS
    // =========================

    public Application updateStatus(
            Long applicationId,
            String status
    ) {

        // Get logged-in recruiter
        User recruiter =
                (User) SecurityContextHolder
                        .getContext()
                        .getAuthentication()
                        .getPrincipal();


        // Find application
        Application application =
                applicationRepository
                        .findById(applicationId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Application not found"
                                )
                        );


        // Find job associated with application
        Job job =
                jobRepository
                        .findById(
                                application.getJobId()
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Job not found"
                                )
                        );


        // =========================
        // CHECK JOB OWNERSHIP
        // =========================

        if (
                job.getRecruiterId() == null ||
                        recruiter.getId() == null ||
                        !job.getRecruiterId()
                                .equals(recruiter.getId())
        ) {

            throw new RuntimeException(
                    "You can only update applications for your own jobs"
            );
        }


        // =========================
        // VALIDATE STATUS
        // =========================

        if (
                !status.equals("PENDING") &&
                        !status.equals("ACCEPTED") &&
                        !status.equals("REJECTED")
        ) {

            throw new RuntimeException(
                    "Invalid application status"
            );
        }


        // Update status
        application.setStatus(status);


        return applicationRepository.save(
                application
        );
    }
}