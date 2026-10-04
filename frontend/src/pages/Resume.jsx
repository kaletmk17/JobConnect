import { useState } from 'react'

function Resume() {

  const [file, setFile] = useState(null)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState(false)

  const handleFileChange = (event) => {

    const selectedFile = event.target.files[0]

    setMessage('')
    setError('')

    if (!selectedFile) {
      setFile(null)
      return
    }

    // Only PDF allowed
    if (selectedFile.type !== 'application/pdf') {
      setFile(null)
      setError('Only PDF files are allowed.')
      return
    }

    // Maximum 5 MB
    if (selectedFile.size > 5 * 1024 * 1024) {
      setFile(null)
      setError('Resume size must be less than 5 MB.')
      return
    }

    setFile(selectedFile)
  }

  const handleUpload = async () => {

    if (!file) {
      setError('Please select your resume PDF.')
      return
    }

    const token = localStorage.getItem('token')

    if (!token) {
      setError('Please login first.')
      return
    }

    setUploading(true)
    setMessage('')
    setError('')

    try {

      const formData = new FormData()

      formData.append('file', file)

      const response = await fetch(
        'http://localhost:8080/api/resume/upload',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        }
      )

      const data = await response.text()

      if (!response.ok) {
        throw new Error(
          data || 'Failed to upload resume'
        )
      }

      setMessage(data)
      setFile(null)

    } catch (error) {

      console.error(
        'Resume upload error:',
        error
      )

      setError(
        error.message ||
        'Unable to upload resume'
      )

    } finally {

      setUploading(false)

    }
  }

  return (

    <div className="jobs-container">

      <div className="applications-header">

        <span className="section-label">
          JOB SEEKER PROFILE
        </span>

        <h1>
          My Resume
        </h1>

        <p>
          Upload your latest resume so recruiters
          can review your profile.
        </p>

      </div>

      <div className="resume-upload-card">

        <div className="resume-icon">
          📄
        </div>

        <h2>
          Upload Your Resume
        </h2>

        <p>
          Upload your resume in PDF format.
          Maximum file size: 5 MB.
        </p>

        <div className="resume-file-input">

          <input
            type="file"
            accept=".pdf,application/pdf"
            onChange={handleFileChange}
          />

        </div>

        {file && (

          <div className="selected-resume">

            <span>
              📎
            </span>

            <div>
              <strong>
                {file.name}
              </strong>

              <p>
                {(file.size / 1024 / 1024).toFixed(2)}
                {' '}MB
              </p>
            </div>

          </div>

        )}

        {error && (

          <div className="resume-message error">
            {error}
          </div>

        )}

        {message && (

          <div className="resume-message success">
            ✅ {message}
          </div>

        )}

        <button
          type="button"
          className="primary-btn resume-upload-btn"
          onClick={handleUpload}
          disabled={uploading}
        >
          {uploading
            ? 'Uploading...'
            : 'Upload Resume →'
          }
        </button>

      </div>

    </div>

  )
}

export default Resume