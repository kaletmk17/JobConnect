import { useEffect, useState } from 'react'
import {
  getMyJobs,
  deleteJob,
  updateJob
} from '../services/jobService'

function MyJobs() {

  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [editingJobId, setEditingJobId] = useState(null)

  const [editForm, setEditForm] = useState({
    title: '',
    company: '',
    location: '',
    salary: '',
    skills: '',
    description: ''
  })

  // Delete a job
  const handleDelete = async (jobId) => {

    const confirmed = window.confirm(
      'Are you sure you want to delete this job?'
    )

    if (!confirmed) {
      return
    }

    try {

      await deleteJob(jobId)

      setJobs((currentJobs) =>
        currentJobs.filter(
          (job) => job.id !== jobId
        )
      )

      alert('Job deleted successfully!')

    } catch (error) {

      console.error(
        'Delete job error:',
        error
      )

      alert(error.message)
    }
  }

  // Start editing a job
  const handleEdit = (job) => {

    setEditingJobId(job.id)

    setEditForm({
      title: job.title,
      company: job.company,
      location: job.location,
      salary: job.salary,
      skills: job.skills,
      description: job.description
    })
  }

  // Handle edit form changes
  const handleEditChange = (event) => {

    const { name, value } = event.target

    setEditForm((currentForm) => ({
      ...currentForm,
      [name]: value
    }))
  }

  // Save edited job
  const handleUpdate = async (event) => {

    event.preventDefault()

    try {

      const jobData = {
        title: editForm.title,
        company: editForm.company,
        location: editForm.location,
        salary: Number(editForm.salary),
        skills: editForm.skills,
        description: editForm.description
      }

      const updatedJob =
        await updateJob(
          editingJobId,
          jobData
        )

      setJobs((currentJobs) =>
        currentJobs.map((job) =>
          job.id === updatedJob.id
            ? updatedJob
            : job
        )
      )

      setEditingJobId(null)

      alert('Job updated successfully!')

    } catch (error) {

      console.error(
        'Update job error:',
        error
      )

      alert(error.message)
    }
  }

  // Cancel editing
  const handleCancelEdit = () => {

    setEditingJobId(null)

  }

  // Fetch recruiter jobs
  useEffect(() => {

    const fetchMyJobs = async () => {

      try {

        const data = await getMyJobs()

        setJobs(data)

      } catch (error) {

        console.error(
          'Error fetching my jobs:',
          error
        )

        setError(
          'Unable to load your jobs'
        )

      } finally {

        setLoading(false)
      }
    }

    fetchMyJobs()

  }, [])

  // Loading
  if (loading) {

    return (
      <div className="jobs-container">
        <h2>Loading your jobs...</h2>
      </div>
    )
  }

  // Error
  if (error) {

    return (
      <div className="jobs-container">
        <h2>{error}</h2>
      </div>
    )
  }

  return (
    <div className="jobs-container">

      <h1>My Posted Jobs</h1>

      {jobs.length === 0 ? (

        <p>
          You have not posted any jobs yet.
        </p>

      ) : (

        <div className="jobs-grid">

          {jobs.map((job) => (

            <div
              className="job-card"
              key={job.id}
            >

              {editingJobId === job.id ? (

                // =========================
                // EDIT FORM
                // =========================

                <form onSubmit={handleUpdate}>

                  <h2>Edit Job</h2>

                  <div className="form-group">

                    <label>
                      Job Title
                    </label>

                    <input
                      type="text"
                      name="title"
                      value={editForm.title}
                      onChange={handleEditChange}
                      required
                    />

                  </div>

                  <div className="form-group">

                    <label>
                      Company
                    </label>

                    <input
                      type="text"
                      name="company"
                      value={editForm.company}
                      onChange={handleEditChange}
                      required
                    />

                  </div>

                  <div className="form-group">

                    <label>
                      Location
                    </label>

                    <input
                      type="text"
                      name="location"
                      value={editForm.location}
                      onChange={handleEditChange}
                      required
                    />

                  </div>

                  <div className="form-group">

                    <label>
                      Salary
                    </label>

                    <input
                      type="number"
                      name="salary"
                      value={editForm.salary}
                      onChange={handleEditChange}
                      required
                    />

                  </div>

                  <div className="form-group">

                    <label>
                      Skills
                    </label>

                    <input
                      type="text"
                      name="skills"
                      value={editForm.skills}
                      onChange={handleEditChange}
                      required
                    />

                  </div>

                  <div className="form-group">

                    <label>
                      Job Description
                    </label>

                    <textarea
                      name="description"
                      value={editForm.description}
                      onChange={handleEditChange}
                      rows="5"
                      required
                    />

                  </div>

                  <button
                    type="submit"
                    className="primary-btn"
                  >
                    Save Changes
                  </button>

                  <button
                    type="button"
                    className="secondary-btn"
                    onClick={handleCancelEdit}
                  >
                    Cancel
                  </button>

                </form>

              ) : (

                // =========================
                // JOB DETAILS
                // =========================

                <>
                  <h2>{job.title}</h2>

                  <p>
                    <strong>Company:</strong>{' '}
                    {job.company}
                  </p>

                  <p>
                    <strong>Location:</strong>{' '}
                    {job.location}
                  </p>

                  <p>
                    <strong>Salary:</strong>{' '}
                    ₹{job.salary}
                  </p>

                  <p>
                    <strong>Skills:</strong>{' '}
                    {job.skills}
                  </p>

                  <p>
                    {job.description}
                  </p>

                  <p>
                    <strong>Job ID:</strong>{' '}
                    {job.id}
                  </p>

                  <div className="application-actions">

                    <button
                      type="button"
                      className="primary-btn"
                      onClick={() =>
                        handleEdit(job)
                      }
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      className="secondary-btn"
                      onClick={() =>
                        handleDelete(job.id)
                      }
                    >
                      Delete
                    </button>

                  </div>
                </>

              )}

            </div>

          ))}

        </div>

      )}

    </div>
  )
}

export default MyJobs