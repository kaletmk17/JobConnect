import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { getMyApplications } from '../services/applicationService'
import { getAllJobs } from '../services/jobService'

function MyApplications() {

  const navigate = useNavigate()

  const [applications, setApplications] = useState([])
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')


  // =========================================
  // LOAD APPLICATIONS + JOBS
  // =========================================

  useEffect(() => {

    const fetchApplications = async () => {

      try {

        const user = JSON.parse(
          localStorage.getItem('user')
        )

        if (!user || !user.id) {

          setError(
            'User information not found. Please login again.'
          )

          return
        }

        const applicationData =
          await getMyApplications(user.id)

        const jobData =
          await getAllJobs()

        setApplications(applicationData)
        setJobs(jobData)

      } catch (error) {

        console.error(
          'Error fetching applications:',
          error
        )

        setError(
          'Unable to load applications'
        )

      } finally {

        setLoading(false)

      }

    }

    fetchApplications()

  }, [])


  // =========================================
  // LOADING
  // =========================================

  if (loading) {

    return (

      <div className="jobs-container">

        <h2>
          Loading applications...
        </h2>

      </div>

    )

  }


  // =========================================
  // ERROR
  // =========================================

  if (error) {

    return (

      <div className="jobs-container">

        <h2>
          {error}
        </h2>

      </div>

    )

  }


  // =========================================
  // APPLICATION COUNTS
  // =========================================

  const totalApplications =
    applications.length

  const pendingApplications =
    applications.filter(
      (application) =>
        application.status === 'PENDING'
    ).length

  const acceptedApplications =
    applications.filter(
      (application) =>
        application.status === 'ACCEPTED'
    ).length

  const rejectedApplications =
    applications.filter(
      (application) =>
        application.status === 'REJECTED'
    ).length


  // =========================================
  // PAGE
  // =========================================

  return (

    <div className="jobs-container">


      {/* =================================
          APPLICATION HEADER
      ================================= */}

      <div className="applications-header">

        <span className="section-label">
          APPLICATION TRACKER
        </span>

        <h1>
          My Applications
        </h1>

        <p>
          Track all your job applications and
          their current status.
        </p>

      </div>


      {/* =================================
          APPLICATION SUMMARY
      ================================= */}

      <div className="application-summary">


        {/* Total */}

        <div className="summary-card">

          <span className="summary-icon total-icon">
            🔵
          </span>

          <div>

            <h3>
              {totalApplications}
            </h3>

            <p>
              Total Applications
            </p>

          </div>

        </div>


        {/* Pending */}

        <div className="summary-card">

          <span className="summary-icon pending-icon">
            🟡
          </span>

          <div>

            <h3>
              {pendingApplications}
            </h3>

            <p>
              Pending
            </p>

          </div>

        </div>


        {/* Accepted */}

        <div className="summary-card">

          <span className="summary-icon accepted-icon">
            🟢
          </span>

          <div>

            <h3>
              {acceptedApplications}
            </h3>

            <p>
              Accepted
            </p>

          </div>

        </div>


        {/* Rejected */}

        <div className="summary-card">

          <span className="summary-icon rejected-icon">
            🔴
          </span>

          <div>

            <h3>
              {rejectedApplications}
            </h3>

            <p>
              Rejected
            </p>

          </div>

        </div>

      </div>


      {/* =================================
          NO APPLICATIONS
      ================================= */}

      {applications.length === 0 ? (

        <div className="no-jobs">

          <div className="no-jobs-icon">
            📄
          </div>

          <h2>
            No Applications Yet
          </h2>

          <p>
            You have not applied for any jobs yet.
          </p>

          <button
            type="button"
            className="primary-btn"
            onClick={() =>
              navigate('/jobs')
            }
          >
            Browse Jobs →
          </button>

        </div>

      ) : (


        /* =================================
           APPLICATION CARDS
        ================================= */

        <div className="jobs-grid">

          {applications.map(
            (application) => {

              const job = jobs.find(
                (job) =>
                  job.id == application.jobId
              )


              return (

                <div
                  className="job-card application-card"
                  key={application.id}
                >


                  {/* =================================
                      JOB HEADER
                  ================================= */}

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


                  {/* =================================
                      JOB INFORMATION
                  ================================= */}

                  <div className="application-info">

                    <p>

                      <strong>
                        📍 Location:
                      </strong>
                      {' '}

                      {job?.location ||
                        'Location'}

                    </p>


                    <p>

                      <strong>
                        🆔 Job ID:
                      </strong>
                      {' '}

                      {application.jobId}

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


                  {/* =================================
                      APPLICATION STATUS
                  ================================= */}

                  <div className="application-status-row">

                    <span className="status-label">
                      Application Status
                    </span>

                    <span
                      className={`status-badge ${application.status.toLowerCase()}`}
                    >
                      {application.status}
                    </span>

                  </div>


                  {/* =================================
                      STATUS MESSAGE
                  ================================= */}

                  {application.status === 'ACCEPTED' && (

                    <div className="candidate-status-message accepted">

                      <strong>
                        🎉 Congratulations!
                      </strong>

                      <p>
                        Your application has been
                        accepted by the recruiter.
                      </p>

                    </div>

                  )}


                  {application.status === 'REJECTED' && (

                    <div className="candidate-status-message rejected">

                      <strong>
                        Application Update
                      </strong>

                      <p>
                        Your application was not
                        selected for this position.
                      </p>

                    </div>

                  )}


                  {application.status === 'PENDING' && (

                    <div className="candidate-status-message pending">

                      <strong>
                        ⏳ Application Under Review
                      </strong>

                      <p>
                        Your application is currently
                        being reviewed by the recruiter.
                      </p>

                    </div>

                  )}


                  {/* =================================
                      VIEW JOB
                  ================================= */}

                  <button
                    type="button"
                    className="view-job-btn"
                    onClick={() =>
                      navigate(
                        `/jobs/${application.jobId}`
                      )
                    }
                  >
                    View Job →
                  </button>

                </div>

              )

            }
          )}

        </div>

      )}

    </div>

  )

}

export default MyApplications