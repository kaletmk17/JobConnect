import { useEffect, useState } from 'react'

const API_BASE_URL = import.meta.env.VITE_API_URL

import {
  getJobApplications,
  updateApplicationStatus
} from '../services/applicationService'

import { getMyJobs } from '../services/jobService'

import { getUserById } from '../services/userService'


function RecruiterApplications() {

  const [jobs, setJobs] = useState([])

  const [selectedJobId, setSelectedJobId] =
    useState('')

  const [applications, setApplications] =
    useState([])

  const [candidates, setCandidates] =
    useState({})

  const [loadingJobs, setLoadingJobs] =
    useState(true)

  const [loadingApplications, setLoadingApplications] =
    useState(false)

  const [error, setError] =
    useState('')


  // =========================
  // LOAD RECRUITER JOBS
  // =========================

  useEffect(() => {

    const fetchJobs = async () => {

      try {

        const data = await getMyJobs()

        setJobs(data)

        // Automatically select first job
        if (data.length > 0) {

          setSelectedJobId(
            data[0].id
          )

        }

      } catch (error) {

        console.error(
          'Error fetching recruiter jobs:',
          error
        )

        setError(
          'Unable to load your jobs'
        )

      } finally {

        setLoadingJobs(false)

      }

    }

    fetchJobs()

  }, [])


  // =========================
  // LOAD APPLICATIONS
  // =========================

  useEffect(() => {

    if (!selectedJobId) {
      return
    }


    const fetchApplications = async () => {

      setLoadingApplications(true)

      setError('')

      try {

        const data =
          await getJobApplications(
            selectedJobId
          )

        setApplications(data)


        // =========================
        // LOAD CANDIDATE DETAILS
        // =========================

        const candidateResults =
          await Promise.all(

            data.map(async (application) => {

              try {

                const user =
                  await getUserById(
                    application.userId
                  )

                return {
                  userId: application.userId,
                  user: user
                }

              } catch (error) {

                console.error(
                  `Error fetching candidate ${application.userId}:`,
                  error
                )

                return {
                  userId: application.userId,
                  user: null
                }

              }

            })

          )


        // Create candidate lookup object
        const candidateMap = {}

        candidateResults.forEach(
          (candidate) => {

            candidateMap[
              candidate.userId
            ] = candidate.user

          }
        )

        setCandidates(candidateMap)

      } catch (error) {

        console.error(
          'Error fetching applications:',
          error
        )

        setError(
          'Unable to load applications'
        )

      } finally {

        setLoadingApplications(false)

      }

    }

    fetchApplications()

  }, [selectedJobId])


  // =========================
  // UPDATE APPLICATION STATUS
  // =========================

  const handleStatusUpdate = async (
    applicationId,
    status
  ) => {

    try {

      const updatedApplication =
        await updateApplicationStatus(
          applicationId,
          status
        )


      setApplications(
        (currentApplications) =>

          currentApplications.map(
            (application) =>

              application.id ===
              updatedApplication.id

                ? updatedApplication

                : application

          )
      )


      alert(
        `Application ${status.toLowerCase()} successfully!`
      )

    } catch (error) {

      console.error(
        'Status update error:',
        error
      )

      alert(error.message)

    }

  }


  // =========================
  // DOWNLOAD RESUME
  // =========================

  const handleDownloadResume = async (
    applicationId,
    candidateName
  ) => {

    const token =
      localStorage.getItem('token')


    if (!token) {

      alert(
        'Please login again.'
      )

      return

    }


    try {

      const response = await fetch(
        `${API_BASE_URL}/api/resume/download/application/${applicationId}`,
        {
          method: 'GET',

          headers: {
            'Authorization':
              `Bearer ${token}`
          }
        }
      )


      if (!response.ok) {

        if (response.status === 403) {

          throw new Error(
            'You are not authorized to download this resume.'
          )

        }


        if (response.status === 404) {

          throw new Error(
            'Resume not found.'
          )

        }


        throw new Error(
          'Unable to download resume.'
        )

      }


      // Convert response into PDF
      const blob =
        await response.blob()


      // Create temporary browser URL
      const url =
        window.URL.createObjectURL(blob)


      // Create download link
      const link =
        document.createElement('a')


      link.href = url

      link.download =
        `${candidateName || 'candidate'}-resume.pdf`


      document.body.appendChild(link)

      link.click()

      link.remove()


      // Remove temporary URL
      window.URL.revokeObjectURL(url)


    } catch (error) {

      console.error(
        'Resume download error:',
        error
      )

      alert(
        error.message ||
        'Unable to download resume.'
      )

    }

  }


  // =========================
  // LOADING JOBS
  // =========================

  if (loadingJobs) {

    return (

      <div className="jobs-container">

        <h2>
          Loading your jobs...
        </h2>

      </div>

    )

  }


  // =========================
  // ERROR
  // =========================

  if (
    error &&
    jobs.length === 0
  ) {

    return (

      <div className="jobs-container">

        <h2>
          {error}
        </h2>

      </div>

    )

  }


  // =========================
  // MAIN UI
  // =========================

  return (

    <div className="jobs-container">


      {/* =========================
          PAGE HEADER
      ========================= */}

      <div className="applications-header">

        <span className="section-label">
          RECRUITER PORTAL
        </span>

        <h1>
          Recruiter Applications
        </h1>

        <p>
          Review candidates and manage
          their application status.
        </p>

      </div>


      {/* =========================
          JOB SELECTOR
      ========================= */}

      {jobs.length === 0 ? (

        <div className="no-jobs">

          <div className="no-jobs-icon">
            💼
          </div>

          <h2>
            No Jobs Posted Yet
          </h2>

          <p>
            You have not posted any jobs yet.
          </p>

        </div>

      ) : (

        <>

          <div className="job-filters">

            <label>
              Select Job
            </label>

            <select
              value={selectedJobId}
              onChange={(event) =>
                setSelectedJobId(
                  event.target.value
                )
              }
            >

              {jobs.map((job) => (

                <option
                  key={job.id}
                  value={job.id}
                >

                  {job.title}
                  {' - '}
                  {job.company}

                </option>

              ))}

            </select>

          </div>


          {/* =========================
              APPLICATIONS
          ========================= */}

          {loadingApplications ? (

            <div className="no-jobs">

              <h2>
                Loading applications...
              </h2>

            </div>

          ) : error ? (

            <div className="no-jobs">

              <h2>
                {error}
              </h2>

            </div>

          ) : applications.length === 0 ? (

            <div className="no-jobs">

              <div className="no-jobs-icon">
                📄
              </div>

              <h2>
                No Applications Found
              </h2>

              <p>
                No candidates have applied
                for this job yet.
              </p>

            </div>

          ) : (

            <div className="jobs-grid">

              {applications.map(
                (application) => {

                  const job =
                    jobs.find(
                      (job) =>
                        job.id ==
                        application.jobId
                    )


                  const candidate =
                    candidates[
                      application.userId
                    ]


                  return (

                    <div
                      className="job-card"
                      key={application.id}
                    >


                      {/* =========================
                          JOB INFORMATION
                      ========================= */}

                      <div className="application-card-header">

                        <div className="job-icon">
                          💼
                        </div>

                        <div>

                          <h2>
                            {job?.title ||
                              'Job Title'}
                          </h2>

                          <p className="application-company">

                            {job?.company ||
                              'Company'}

                          </p>

                        </div>

                      </div>


                      {/* =========================
                          CANDIDATE INFORMATION
                      ========================= */}

                      <div className="application-info">

                        <p>

                          <strong>
                            👤 Candidate:
                          </strong>

                          {' '}

                          {candidate?.name ||
                            'Loading...'}

                        </p>


                        <p>

                          <strong>
                            📧 Email:
                          </strong>

                          {' '}

                          {candidate?.email ||
                            'Loading...'}

                        </p>


                        <p>

                          <strong>
                            🆔 Candidate ID:
                          </strong>

                          {' '}

                          {application.userId}

                        </p>


                        <p>

                          <strong>
                            📅 Applied At:
                          </strong>

                          {' '}

                          {new Date(
                            application.appliedAt
                          ).toLocaleString(
                            'en-IN',
                            {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            }
                          )}

                        </p>

                      </div>


                      {/* =========================
                          APPLICATION STATUS
                      ========================= */}

                      <div className="application-status-row">

                        <span className="status-label">
                          Application Status
                        </span>

                        <span
                          className={
                            `status-badge ${
                              application.status.toLowerCase()
                            }`
                          }
                        >

                          {application.status}

                        </span>

                      </div>


                      {/* =========================
                          DOWNLOAD RESUME
                      ========================= */}

                      <div className="resume-download-section">

                        <button
                          type="button"
                          className="secondary-btn"
                          onClick={() =>
                            handleDownloadResume(
                              application.id,
                              candidate?.name
                            )
                          }
                        >

                          📄 Download Resume

                        </button>

                      </div>


                      {/* =========================
                          STATUS ACTIONS
                      ========================= */}

                      <div className="application-actions">

                        {application.status === 'PENDING' ? (

                          <>

                            <button
                              type="button"
                              className="primary-btn"
                              onClick={() =>
                                handleStatusUpdate(
                                  application.id,
                                  'ACCEPTED'
                                )
                              }
                            >

                              Accept

                            </button>


                            <button
                              type="button"
                              className="secondary-btn"
                              onClick={() =>
                                handleStatusUpdate(
                                  application.id,
                                  'REJECTED'
                                )
                              }
                            >

                              Reject

                            </button>

                          </>

                        ) : application.status === 'ACCEPTED' ? (

                          <div className="application-final-status accepted">

                            ✓ Application Accepted

                          </div>

                        ) : (

                          <div className="application-final-status rejected">

                            ✕ Application Rejected

                          </div>

                        )}

                      </div>


                    </div>

                  )

                }
              )}

            </div>

          )}

        </>

      )}

    </div>

  )

}

export default RecruiterApplications