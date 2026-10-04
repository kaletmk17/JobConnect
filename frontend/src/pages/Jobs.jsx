import { useEffect, useState, useRef } from 'react'
import { getAllJobs } from '../services/jobService'
import { applyForJob } from '../services/applicationService'
import { useNavigate } from 'react-router-dom'

function Jobs() {

  const navigate = useNavigate()

  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [search, setSearch] = useState('')
  const [locationFilter, setLocationFilter] = useState('')
  const [skillsFilter, setSkillsFilter] = useState('')

  // ==============================
  // APPLY / RESUME
  // ==============================

  const [selectedJobId, setSelectedJobId] = useState(null)
  const [showApplyModal, setShowApplyModal] = useState(false)
  const [selectedResume, setSelectedResume] = useState(null)
  const [applying, setApplying] = useState(false)

  const resumeInputRef = useRef(null)

  // ==============================
  // APPLY NOW
  // ==============================

  const handleApply = (jobId) => {

    const token =
      localStorage.getItem('token')

    if (!token) {
      alert(
        'Please login to apply for a job.'
      )
      return
    }

    const storedUser =
      localStorage.getItem('user')

    const user =
      storedUser
        ? JSON.parse(storedUser)
        : null

    if (
      !user ||
      user.role !== 'JOB_SEEKER'
    ) {
      alert(
        'Only Job Seekers can apply for jobs.'
      )
      return
    }

    // Select job only
    // DO NOT open file manager here
    setSelectedJobId(jobId)

    // Open application popup
    setShowApplyModal(true)

    // Clear previous resume
    setSelectedResume(null)
  }

  // ==============================
  // CLOSE APPLY MODAL
  // ==============================

  const closeApplyModal = () => {

    setShowApplyModal(false)
    setSelectedJobId(null)
    setSelectedResume(null)

    if (resumeInputRef.current) {
      resumeInputRef.current.value = ''
    }
  }

  // ==============================
  // SELECT RESUME
  // ==============================

  const handleResumeSelected = (
    event
  ) => {

    const file =
      event.target.files[0]

    if (!file) {
      return
    }

    // Check PDF
    if (
      file.type !==
      'application/pdf'
    ) {

      alert(
        'Only PDF files are allowed.'
      )

      event.target.value = ''
      setSelectedResume(null)

      return
    }

    // Check file size
    if (
      file.size >
      5 * 1024 * 1024
    ) {

      alert(
        'Resume size must be less than 5 MB.'
      )

      event.target.value = ''
      setSelectedResume(null)

      return
    }

    setSelectedResume(file)
  }

  // ==============================
  // SUBMIT APPLICATION
  // ==============================

  const handleSubmitApplication =
    async () => {

      if (!selectedJobId) {

        alert(
          'Please select a job.'
        )

        return
      }

      if (!selectedResume) {

        alert(
          'Please select your resume.'
        )

        return
      }

      try {

        setApplying(true)

        await applyForJob(
          selectedJobId,
          selectedResume
        )

        alert(
          'Application submitted successfully!'
        )

        closeApplyModal()

      } catch (error) {

        console.error(
          'Application error:',
          error
        )

        alert(
          error.message ||
          'Failed to apply for job.'
        )

      } finally {

        setApplying(false)

      }
    }

  // ==============================
  // LOAD ALL JOBS
  // ==============================

  useEffect(() => {

    const fetchJobs = async () => {

      try {

        const data =
          await getAllJobs()

        setJobs(data)

      } catch (error) {

        console.error(
          'Error fetching jobs:',
          error
        )

        setError(
          'Unable to load jobs'
        )

      } finally {

        setLoading(false)

      }
    }

    fetchJobs()

  }, [])

  // ==============================
  // FILTER JOBS
  // ==============================

  const filteredJobs =
    jobs.filter((job) => {

      const searchText =
        search.toLowerCase()

      const locationText =
        locationFilter.toLowerCase()

      const skillsText =
        skillsFilter.toLowerCase()

      const matchesSearch =
        job.title
          .toLowerCase()
          .includes(searchText) ||
        job.company
          .toLowerCase()
          .includes(searchText)

      const matchesLocation =
        job.location
          .toLowerCase()
          .includes(locationText)

      const matchesSkills =
        job.skills
          .toLowerCase()
          .includes(skillsText)

      return (
        matchesSearch &&
        matchesLocation &&
        matchesSkills
      )
    })

  // ==============================
  // LOADING
  // ==============================

  if (loading) {

    return (
      <div className="jobs-container">

        <h2>
          Loading jobs...
        </h2>

      </div>
    )
  }

  // ==============================
  // ERROR
  // ==============================

  if (error) {

    return (
      <div className="jobs-container">

        <h2>
          {error}
        </h2>

      </div>
    )
  }

  // ==============================
  // PAGE
  // ==============================

  return (

    <div className="jobs-container">

      {/* =================================
          HIDDEN RESUME INPUT
      ================================= */}

      <input
        type="file"
        ref={resumeInputRef}
        accept="application/pdf"
        style={{
          display: 'none'
        }}
        onChange={handleResumeSelected}
      />

      {/* =================================
          PAGE HEADER
      ================================= */}

      <div className="jobs-header">

        <span className="section-label">
          CAREER OPPORTUNITIES
        </span>

        <h1>
          Find Your Next Job
        </h1>

        <p>
          Explore job opportunities and find
          the right career for you.
        </p>

      </div>

      {/* =================================
          SEARCH & FILTERS
      ================================= */}

      <div className="job-filters">

        <input
          type="text"
          placeholder="🔍 Search job title or company"
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
        />

        <input
          type="text"
          placeholder="📍 Filter by location"
          value={locationFilter}
          onChange={(event) =>
            setLocationFilter(
              event.target.value
            )
          }
        />

        <input
          type="text"
          placeholder="💼 Filter by skills"
          value={skillsFilter}
          onChange={(event) =>
            setSkillsFilter(
              event.target.value
            )
          }
        />

      </div>

      {/* =================================
          JOB COUNT
      ================================= */}

      <div className="jobs-result-info">

        <p>

          <strong>
            {filteredJobs.length}
          </strong>

          {' '}

          {filteredJobs.length === 1
            ? 'job'
            : 'jobs'
          }

          {' '}found

        </p>

      </div>

      {/* =================================
          NO JOBS
      ================================= */}

      {filteredJobs.length === 0 ? (

        <div className="no-jobs">

          <div className="no-jobs-icon">
            🔍
          </div>

          <h2>
            No Jobs Found
          </h2>

          <p>
            Try changing your search or
            filter criteria.
          </p>

        </div>

      ) : (

        /* =================================
           JOB CARDS
        ================================= */

        <div className="jobs-grid">

          {filteredJobs.map((job) => (

            <div
              className="job-card"
              key={job.id}
            >

              {/* Job Icon */}

              <div className="job-card-top">

                <div className="job-icon">
                  💼
                </div>

              </div>

              {/* Job Title */}

              <h2>
                {job.title}
              </h2>

              {/* Company */}

              <p>

                <strong>
                  🏢 Company:
                </strong>

                {' '}

                {job.company}

              </p>

              {/* Location */}

              <p>

                <strong>
                  📍 Location:
                </strong>

                {' '}

                {job.location}

              </p>

              {/* Salary */}

              <p>

                <strong>
                  💰 Salary:
                </strong>

                {' '}

                ₹
                {Number(
                  job.salary
                ).toLocaleString('en-IN')}

                {' '}per year

              </p>

              {/* Skills */}

              <p>

                <strong>
                  🛠 Skills:
                </strong>

                {' '}

                {job.skills}

              </p>

              {/* Description */}

              <p className="job-description">

                {job.description}

              </p>

              {/* =================================
                  ACTION BUTTONS
              ================================= */}

              <div className="job-card-actions">

                {/* View Details */}

                <button
                  type="button"
                  className="secondary-btn"
                  onClick={() =>
                    navigate(
                      `/jobs/${job.id}`
                    )
                  }
                >
                  View Details →
                </button>

                {/* Apply Now */}

                <button
                  type="button"
                  className="primary-btn"
                  onClick={() =>
                    handleApply(job.id)
                  }
                >
                  Apply Now →
                </button>

              </div>

            </div>

          ))}

        </div>

      )}

      {/* =================================
          APPLY MODAL
      ================================= */}

      {showApplyModal && (

        <div
          className="apply-modal-overlay"
          onClick={closeApplyModal}
        >

          <div
            className="apply-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            {/* Close */}

            <button
              type="button"
              className="apply-modal-close"
              onClick={closeApplyModal}
            >
              ✕
            </button>

            <div className="apply-modal-icon">
              📄
            </div>

            <h2>
              Apply for this Job
            </h2>

            <p>
              Please select your resume
              to submit your application.
            </p>

            {/* SELECT RESUME */}

            <button
              type="button"
              className="secondary-btn resume-select-btn"
              onClick={() =>
                resumeInputRef.current.click()
              }
            >
              📎 Select Resume
            </button>

            {/* SELECTED FILE */}

            {selectedResume && (

              <div className="selected-resume">

                <span>
                  📄
                </span>

                <div>

                  <strong>
                    {selectedResume.name}
                  </strong>

                  <small>
                    {' '}
                    (
                    {(
                      selectedResume.size /
                      1024 /
                      1024
                    ).toFixed(2)}
                    {' '}MB)
                  </small>

                </div>

              </div>

            )}

            {/* SUBMIT */}

            <button
              type="button"
              className="primary-btn submit-application-btn"
              onClick={handleSubmitApplication}
              disabled={
                !selectedResume ||
                applying
              }
            >
              {applying
                ? 'Submitting...'
                : 'Submit Application'}
            </button>

            {/* CANCEL */}

            <button
              type="button"
              className="cancel-application-btn"
              onClick={closeApplyModal}
            >
              Cancel
            </button>

            <p className="resume-note">
              PDF only • Maximum 5 MB
            </p>

          </div>

        </div>

      )}

    </div>
  )
}

export default Jobs