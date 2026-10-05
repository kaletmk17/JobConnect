package com.jobconnect.service;

import com.jobconnect.model.Job;
import com.jobconnect.model.User;
import com.jobconnect.repository.JobRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class JobService {

    private final JobRepository jobRepository;

    public JobService(JobRepository jobRepository) {
        this.jobRepository = jobRepository;
    }

    // =========================
    // CREATE JOB
    // =========================

    public Job createJob(Job job) {

        User recruiter = (User) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();

        // Automatically assign logged-in recruiter
        job.setRecruiterId(recruiter.getId());

        return jobRepository.save(job);
    }


    // =========================
    // GET ALL JOBS
    // =========================

    public List<Job> getAllJobs() {

        return jobRepository.findAll();
    }


    // =========================
    // GET JOB BY ID
    // =========================

    public Job getJobById(Long id) {

        return jobRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Job not found"
                        )
                );
    }


    // =========================
    // GET RECRUITER'S JOBS
    // =========================

    public List<Job> getJobsByRecruiter(
            Long recruiterId
    ) {

        return jobRepository
                .findByRecruiterId(recruiterId);
    }


    // =========================
    // DELETE JOB
    // =========================

    public void deleteJob(Long id) {

        // Get logged-in recruiter
        User recruiter = (User) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();


        // Find job
        Job existingJob = jobRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Job not found"
                        )
                );


        // Check ownership
        if (
                existingJob.getRecruiterId() == null ||
                        recruiter.getId() == null ||
                        !existingJob.getRecruiterId()
                                .equals(recruiter.getId())
        ) {

            throw new RuntimeException(
                    "You can only delete your own jobs"
            );
        }


        // Delete the job
        jobRepository.delete(existingJob);
    }


    // =========================
    // UPDATE JOB
    // =========================

    public Job updateJob(
            Long id,
            Job updatedJob
    ) {

        // Get logged-in recruiter
        User recruiter = (User) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();


        // Find existing job
        Job existingJob = jobRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Job not found"
                        )
                );


        // Check ownership
        if (
                existingJob.getRecruiterId() == null ||
                        recruiter.getId() == null ||
                        !existingJob.getRecruiterId()
                                .equals(recruiter.getId())
        ) {

            throw new RuntimeException(
                    "You can only update your own jobs"
            );
        }


        // Update job details
        existingJob.setTitle(
                updatedJob.getTitle()
        );

        existingJob.setCompany(
                updatedJob.getCompany()
        );

        existingJob.setLocation(
                updatedJob.getLocation()
        );

        existingJob.setDescription(
                updatedJob.getDescription()
        );

        existingJob.setSkills(
                updatedJob.getSkills()
        );

        existingJob.setSalary(
                updatedJob.getSalary()
        );


        return jobRepository.save(existingJob);
    }


    // =========================
    // SEARCH JOBS
    // =========================

    public List<Job> searchJobs(
            String keyword
    ) {

        return jobRepository
                .findByTitleContainingIgnoreCaseOrSkillsContainingIgnoreCase(
                        keyword,
                        keyword
                );
    }
}