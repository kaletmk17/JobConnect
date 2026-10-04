import { useState } from 'react'
import { createJob } from '../services/jobService'
function PostJob() {

  const [title, setTitle] = useState('')
  const [company, setCompany] = useState('')
  const [location, setLocation] = useState('')
  const [salary, setSalary] = useState('')
  const [skills, setSkills] = useState('')
  const [description, setDescription] = useState('')

  const handleSubmit = async (event) => {

    event.preventDefault()

    try {

      const jobData = {
        title,
        company,
        location,
        salary: Number(salary),
        skills,
        description
      }

      const response = await createJob(jobData)

      console.log('Job created:', response)

      alert('Job posted successfully!')

      setTitle('')
      setCompany('')
      setLocation('')
      setSalary('')
      setSkills('')
      setDescription('')

    } catch (error) {

      console.error('Job creation error:', error)

      alert(error.message)
    }
  }

  return (
    <div className="auth-container">

      <div className="auth-card">

        <h2>Post a New Job</h2>

        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label>Job Title</label>
            <input
              type="text"
              placeholder="e.g. Java Developer"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Company</label>
            <input
              type="text"
              placeholder="Enter company name"
              value={company}
              onChange={(event) => setCompany(event.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Location</label>
            <input
              type="text"
              placeholder="e.g. Pune"
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Salary</label>
            <input
              type="number"
              placeholder="e.g. 600000"
              value={salary}
              onChange={(event) => setSalary(event.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Skills</label>
            <input
              type="text"
              placeholder="Java, Spring Boot, MySQL"
              value={skills}
              onChange={(event) => setSkills(event.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Job Description</label>
            <textarea
              placeholder="Enter job description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              required
              rows="5"
            />
          </div>

          <button
            type="submit"
            className="primary-btn login-btn"
          >
            Post Job
          </button>

        </form>

      </div>

    </div>
  )
}

export default PostJob