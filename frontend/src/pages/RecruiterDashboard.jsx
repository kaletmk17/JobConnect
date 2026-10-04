import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { getMyJobs } from '../services/jobService'
import { getJobApplications } from '../services/applicationService'

function RecruiterDashboard() {

  const navigate = useNavigate()

  const [jobs, setJobs] = useState([])
  const [applicationCount, setApplicationCount] = useState(0)
  const [applicationStats, setApplicationStats] = useState({
    total: 0,
    pending: 0,
    accepted: 0,
    rejected: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {

    const fetchDashboardData = async () => {

      try {

        // Get only jobs posted by logged-in recruiter
        const data = await getMyJobs()

        setJobs(data)

        // Get applications for each recruiter's job
        const applicationResults =
          await Promise.all(
            data.map((job) =>
              getJobApplications(job.id)
            )
          )

        // Calculate total applications
        const allApplications =
          applicationResults.flat()

        const totalApplications =
          allApplications.length

        const pendingApplications =
          allApplications.filter(
            (application) =>
              application.status === 'PENDING'
          ).length

        const acceptedApplications =
          allApplications.filter(
            (application) =>
              application.status === 'ACCEPTED'
          ).length

        const rejectedApplications =
          allApplications.filter(
            (application) =>
              application.status === 'REJECTED'
          ).length

        setApplicationCount(totalApplications)

        setApplicationStats({
          total: totalApplications,
          pending: pendingApplications,
          accepted: acceptedApplications,
          rejected: rejectedApplications
        })

      } catch (error) {

        console.error(
          'Error fetching recruiter dashboard data:',
          error
        )

        setError(
          'Unable to load dashboard'
        )

      } finally {

        setLoading(false)

      }

    }

    fetchDashboardData()

  }, [])

  /*
   * Loading state
   */
  if (loading) {

    return (
      <div className="jobs-container">

        <h2>
          Loading dashboard...
        </h2>

      </div>
    )

  }

  /*
   * Error state
   */
  if (error) {

    return (
      <div className="jobs-container">

        <h2>
          {error}
        </h2>

      </div>
    )

  }

  /*
   * Dashboard
   */
  return (

    <div className="jobs-container">

      {/* Dashboard Header */}

      <div className="applications-header">

        <span className="section-label">
          RECRUITER PORTAL
        </span>

        <h1>
          Recruiter Dashboard
        </h1>

        <p>
          Manage your job postings and
          connect with talented candidates.
        </p>

      </div>


      {/* Dashboard Summary */}

      <div className="application-summary">

        {/* Total Jobs */}

        <div className="summary-card">

          <span className="summary-icon total-icon">
            💼
          </span>

          <div>

            <h3>
              {jobs.length}
            </h3>

            <p>
              Total Jobs
            </p>

          </div>

        </div>


        {/* Active Jobs */}

        <div className="summary-card">

          <span className="summary-icon accepted-icon">
            🟢
          </span>

          <div>

            <h3>
              {jobs.length}
            </h3>

            <p>
              Active Jobs
            </p>

          </div>

        </div>


        {/* Manage Jobs */}

        <div className="summary-card">

          <span className="summary-icon pending-icon">
            📋
          </span>

          <div>

            <h3>
              {jobs.length}
            </h3>

            <p>
              Manage Jobs
            </p>

          </div>

        </div>


        {/* Applications */}

        <div className="summary-card">

          <span className="summary-icon rejected-icon">
            👥
          </span>

          <div>

            <h3>
              {applicationCount}
            </h3>

            <p>
              Applications
            </p>

          </div>

        </div>

      </div>

{/* Application Statistics */}

<div className="dashboard-section application-statistics">

  <div className="dashboard-section-header">

    <div>

      <span className="section-label">
        APPLICATION OVERVIEW
      </span>

      <h2>
        Application Statistics
      </h2>

    </div>

  </div>

  <div className="application-summary">

    {/* Total Applications */}

    <div className="summary-card">

      <span className="summary-icon total-icon">
        📊
      </span>

      <div>

        <h3>
          {applicationStats.total}
        </h3>

        <p>
          Total Applications
        </p>

      </div>

    </div>


    {/* Pending Applications */}

    <div className="summary-card">

      <span className="summary-icon pending-icon">
        🟡
      </span>

      <div>

        <h3>
          {applicationStats.pending}
        </h3>

        <p>
          Pending
        </p>

      </div>

    </div>


    {/* Accepted Applications */}

    <div className="summary-card">

      <span className="summary-icon accepted-icon">
        🟢
      </span>

      <div>

        <h3>
          {applicationStats.accepted}
        </h3>

        <p>
          Accepted
        </p>

      </div>

    </div>


    {/* Rejected Applications */}

    <div className="summary-card">

      <span className="summary-icon rejected-icon">
        🔴
      </span>

      <div>

        <h3>
          {applicationStats.rejected}
        </h3>

        <p>
          Rejected
        </p>

      </div>

    </div>

  </div>

</div>
      {/* Dashboard Actions */}

      <div className="dashboard-actions">

        <button
          type="button"
          className="primary-btn"
          onClick={() =>
            navigate('/post-job')
          }
        >
          + Post New Job
        </button>


        <button
          type="button"
          className="secondary-btn"
          onClick={() =>
            navigate('/my-jobs')
          }
        >
          Manage My Jobs
        </button>


        <button
          type="button"
          className="secondary-btn"
          onClick={() =>
            navigate('/recruiter-applications')
          }
        >
          View Applications
        </button>

      </div>


      {/* Recent Jobs Section */}

      <div className="dashboard-section">

        <div className="dashboard-section-header">

          <div>

            <span className="section-label">
              YOUR POSTINGS
            </span>

            <h2>
              Recent Jobs
            </h2>

          </div>


          <button
            type="button"
            className="view-all-btn"
            onClick={() =>
              navigate('/my-jobs')
            }
          >
            View All →
          </button>

        </div>


        {/* No Jobs */}

        {jobs.length === 0 ? (

          <div className="no-jobs">

            <div className="no-jobs-icon">
              💼
            </div>

            <h2>
              No Jobs Posted Yet
            </h2>

            <p>
              Start by posting your first job.
            </p>

            <button
              type="button"
              className="primary-btn"
              onClick={() =>
                navigate('/post-job')
              }
            >
              Post Your First Job →
            </button>

          </div>

        ) : (

          /* Job Cards */

          <div className="jobs-grid">

            {jobs
              .slice(0, 6)
              .map((job) => (

                <div
                  className="job-card"
                  key={job.id}
                >

                  <div className="job-card-top">

                    <div className="job-icon">
                      💼
                    </div>

                  </div>


                  <h2>
                    {job.title}
                  </h2>


                  <p>

                    <strong>
                      🏢 Company:
                    </strong>{' '}

                    {job.company}

                  </p>


                  <p>

                    <strong>
                      📍 Location:
                    </strong>{' '}

                    {job.location}

                  </p>


                  <p>

                    <strong>
                      💰 Salary:
                    </strong>{' '}

                    ₹
                    {Number(
                      job.salary
                    ).toLocaleString('en-IN')}

                    {' '}per year

                  </p>


                  <button
                    type="button"
                    className="primary-btn"
                    onClick={() =>
                      navigate(
                        `/jobs/${job.id}`
                      )
                    }
                  >
                    View Job →
                  </button>

                </div>

              ))}

          </div>

        )}

      </div>

    </div>

  )
}

export default RecruiterDashboard