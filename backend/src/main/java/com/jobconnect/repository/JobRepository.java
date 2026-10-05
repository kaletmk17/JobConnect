package com.jobconnect.repository;

import com.jobconnect.model.Job;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface JobRepository extends JpaRepository<Job, Long> {

    List<Job> findByTitleContainingIgnoreCaseOrSkillsContainingIgnoreCase(
            String title,
            String skills
    );

    List<Job> findByRecruiterId(Long recruiterId);
}