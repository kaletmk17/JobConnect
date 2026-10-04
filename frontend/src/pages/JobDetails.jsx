import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getAllJobs } from '../services/jobService'
import { applyForJob } from '../services/applicationService'

function JobDetails() {

  const { jobId } = useParams()
  const navigate = useNavigate()

  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')


  // =========================================
  // APPLY FOR JOB
  // =========================================

  const handleApply = async () => {

    const token = localStorage.getItem('token')

    // User is not logged in
    if (!token) {

      alert('Please login to apply for a job.')

      navigate('/login')

      return
    }


    // Get logged-in user
    const user = JSON.parse(
      localStorage.getItem('user') || 'null'
    )


    // Only Job Seekers can apply
    if (user?.role !== 'JOB_SEEKER') {

      alert(
        'Only Job Seekers can apply for jobs.'
      )

      return
    }


    // Apply for job
    try {

      await applyForJob(job.id)

      alert(
        'Application submitted successfully!'
      )

      navigate('/my-applications')

    } catch (error) {

      console.error(
        'Application error:',
        error
      )

      alert(
        error.message ||
        'Unable to apply for this job.'
      )

    }

  }


  // =========================================
  // LOAD JOB
  // =========================================

  useEffect(() => {

    const fetchJob = async () => {

      try {

        const jobs = await getAllJobs()

        const foundJob = jobs.find(
          (item) =>
            item.id == jobId
        )


        if (!foundJob) {

          setError(
            'Job not found'
          )

          return
        }


        setJob(foundJob)

      } catch (error) {

        console.error(
          'Error fetching job:',
          error
        )

        setError(
          'Unable to load job details'
        )

      } finally {

        setLoading(false)

      }

    }


    fetchJob()

  }, [jobId])


  // =========================================
  // LOADING
  // =========================================

  if (loading) {

    return (

      <div className="jobs-container">

        <h2>
          Loading job details...
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


        <button
          type="button"
          className="primary-btn"
          onClick={() =>
            navigate('/jobs')
          }
        >
          ← Back to Jobs
        </button>

      </div>

    )

  }


  // =========================================
  // JOB DETAILS
  // =========================================

  return (

    <div className="jobs-container">


      {/* =================================
          BACK BUTTON
          ================================= */}

      <button
        type="button"
        className="back-btn"
        onClick={() =>
          navigate('/jobs')
        }
      >
        ← Back to Jobs
      </button>


      {/* =================================
          JOB HEADER
          ================================= */}

      <div className="job-details-header">

        <div className="job-details-icon">
          💼
        </div>


        <div>

          <span className="section-label">
            JOB OPPORTUNITY
          </span>


          <h1>
            {job.title}
          </h1>


          <p className="job-details-company">
            {job.company}
          </p>

        </div>

      </div>


      {/* =================================
          JOB INFORMATION
          ================================= */}

      <div className="job-details-grid">


        {/* Job Information */}

        <div className="job-details-card">

          <h2>
            Job Information
          </h2>


          <p>

            <strong>
              📍 Location
            </strong>

            <br />

            {job.location}

          </p>


          <p>

            <strong>
              💰 Salary
            </strong>

            <br />

            ₹
            {Number(
              job.salary
            ).toLocaleString('en-IN')}

            {' '}per year

          </p>


          <p>

            <strong>
              🛠 Skills
            </strong>

            <br />

            {job.skills}

          </p>

        </div>


        {/* =================================
            JOB DESCRIPTION
            ================================= */}

        <div className="job-details-card">

          <h2>
            Job Description
          </h2>


          <p className="job-full-description">
            {job.description}
          </p>

        </div>

      </div>


      {/* =================================
          APPLY SECTION
          ================================= */}

      <div className="job-details-action">

        <button
          type="button"
          className="primary-btn"
          onClick={handleApply}
        >

          {localStorage.getItem('token')

            ? JSON.parse(
                localStorage.getItem('user') || 'null'
              )?.role === 'JOB_SEEKER'

              ? 'Apply for this Job →'

              : 'Recruiters Cannot Apply'

            : 'Login to Apply →'

          }

        </button>

      </div>

    </div>

  )

}

export default JobDetails