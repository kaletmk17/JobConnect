import { useEffect, useRef, useState } from 'react'

function Profile() {

  // ==============================
  // PROFILE STATE
  // ==============================

  const [profile, setProfile] = useState(null)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [education, setEducation] = useState('')
  const [skills, setSkills] = useState('')

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  // ==============================
  // RESUME
  // ==============================

  const [resumeFile, setResumeFile] = useState(null)
  const [uploadingResume, setUploadingResume] =
    useState(false)

  const resumeInputRef = useRef(null)


  // ==============================
  // LOAD PROFILE
  // ==============================

  useEffect(() => {

    const loadProfile = async () => {

      const token =
        localStorage.getItem('token')

      if (!token) {

        setError(
          'Please login to view your profile.'
        )

        setLoading(false)

        return
      }

      try {

        const response = await fetch(
          'http://localhost:8080/api/users/profile',
          {
            method: 'GET',
            headers: {
              'Authorization':
                `Bearer ${token}`
            }
          }
        )

       if (!response.ok) {

         const errorText =
           await response.text()

         throw new Error(
           `Profile API failed: ${response.status} ${errorText}`
         )
       }

        const data =
          await response.json()

        setProfile(data)

        setName(
          data.name || ''
        )

        setEmail(
          data.email || ''
        )

        setPhone(
          data.phone || ''
        )

        setEducation(
          data.education || ''
        )

        setSkills(
          data.skills || ''
        )

      } catch (error) {

        console.error(
          'Profile loading error:',
          error
        )

        setError(
          error.message ||
          'Unable to load profile.'
        )

      } finally {

        setLoading(false)

      }
    }

    loadProfile()

  }, [])


  // ==============================
  // SAVE PROFILE
  // ==============================

  const handleSaveProfile =
    async () => {

      const token =
        localStorage.getItem('token')

      if (!token) {

        alert(
          'Please login again.'
        )

        return
      }

      setSaving(true)
      setMessage('')
      setError('')

      try {

        const response = await fetch(
          'http://localhost:8080/api/users/profile',
          {
            method: 'PUT',

            headers: {
              'Authorization':
                `Bearer ${token}`,

              'Content-Type':
                'application/json'
            },

            body: JSON.stringify({
              name,
              phone,
              education,
              skills
            })
          }
        )

        if (!response.ok) {

          const errorText =
            await response.text()

          throw new Error(
            errorText ||
            'Failed to update profile'
          )
        }

        const updatedProfile =
          await response.json()

        setProfile(
          updatedProfile
        )

        setName(
          updatedProfile.name || ''
        )

        setPhone(
          updatedProfile.phone || ''
        )

        setEducation(
          updatedProfile.education || ''
        )

        setSkills(
          updatedProfile.skills || ''
        )

        // Update navbar user name
        const storedUser =
          localStorage.getItem('user')

        if (storedUser) {

          const user =
            JSON.parse(storedUser)

          user.name =
            updatedProfile.name

          localStorage.setItem(
            'user',
            JSON.stringify(user)
          )
        }

        setMessage(
          'Profile updated successfully!'
        )

      } catch (error) {

        console.error(
          'Profile update error:',
          error
        )

        setError(
          error.message ||
          'Failed to update profile.'
        )

      } finally {

        setSaving(false)

      }
    }


  // ==============================
  // SELECT RESUME
  // ==============================

  const handleResumeSelected =
    (event) => {

      const file =
        event.target.files[0]

      if (!file) {
        return
      }

      // PDF only

      if (
        file.type !==
        'application/pdf'
      ) {

        alert(
          'Only PDF files are allowed.'
        )

        event.target.value = ''

        return
      }

      // Maximum 5 MB

      if (
        file.size >
        5 * 1024 * 1024
      ) {

        alert(
          'Resume size must be less than 5 MB.'
        )

        event.target.value = ''

        return
      }

      setResumeFile(file)
    }


  // ==============================
  // UPLOAD RESUME
  // ==============================

  const handleUploadResume =
    async () => {

      if (!resumeFile) {

        alert(
          'Please select a resume first.'
        )

        return
      }

      const token =
        localStorage.getItem('token')

      if (!token) {

        alert(
          'Please login again.'
        )

        return
      }

      setUploadingResume(true)

      try {

        const formData =
          new FormData()

        formData.append(
          'file',
          resumeFile
        )

        const response =
          await fetch(
            'http://localhost:8080/api/resume/upload',
            {
              method: 'POST',

              headers: {
                'Authorization':
                  `Bearer ${token}`
              },

              body: formData
            }
          )

        if (!response.ok) {

          const errorText =
            await response.text()

          throw new Error(
            errorText ||
            'Failed to upload resume.'
          )
        }

        const successMessage =
          await response.text()

        setMessage(
          successMessage ||
          'Resume uploaded successfully!'
        )

        // Update displayed filename

        setProfile(
          (currentProfile) => ({
            ...currentProfile,
            resumeFileName:
              resumeFile.name
          })
        )

        setResumeFile(null)

        if (resumeInputRef.current) {
          resumeInputRef.current.value = ''
        }

      } catch (error) {

        console.error(
          'Resume upload error:',
          error
        )

        setError(
          error.message ||
          'Failed to upload resume.'
        )

      } finally {

        setUploadingResume(false)

      }
    }


  // ==============================
  // LOADING
  // ==============================

  if (loading) {

    return (
      <div className="profile-container">

        <div className="profile-card">

          <h2>
            Loading Profile...
          </h2>

        </div>

      </div>
    )
  }


  // ==============================
  // ERROR
  // ==============================

  if (error && !profile) {

    return (
      <div className="profile-container">

        <div className="profile-card">

          <h2>
            Unable to load profile
          </h2>

          <p>
            {error}
          </p>

        </div>

      </div>
    )
  }


  // ==============================
  // MAIN PROFILE
  // ==============================

  return (

    <div className="profile-container">

      {/* ==========================
          HEADER
      ========================== */}

      <div className="profile-header">

        <span className="section-label">
          MY ACCOUNT
        </span>

        <h1>
          My Profile
        </h1>

        <p>
          Manage your personal information,
          education, skills and resume.
        </p>

      </div>


      {/* ==========================
          PROFILE CARD
      ========================== */}

      <div className="profile-card">

        {/* PROFILE AVATAR */}

        <div className="profile-avatar">
          👤
        </div>


        {/* ==========================
            NAME
        ========================== */}

        <div className="profile-section">

          <label>
            Full Name
          </label>

          <input
            type="text"
            value={name}
            onChange={(event) =>
              setName(
                event.target.value
              )
            }
            placeholder="Enter your full name"
          />

        </div>


        {/* ==========================
            EMAIL
        ========================== */}

        <div className="profile-section">

          <label>
            Email Address
          </label>

          <input
            type="email"
            value={email}
            readOnly
            className="profile-readonly"
          />

          <small className="profile-help">
            Email cannot be changed.
          </small>

        </div>


        {/* ==========================
            PHONE
        ========================== */}

        <div className="profile-section">

          <label>
            📱 Contact Number
          </label>

          <input
            type="tel"
            value={phone}
            onChange={(event) =>
              setPhone(
                event.target.value
              )
            }
            placeholder="Enter your contact number"
            maxLength="10"
          />

        </div>


        {/* ==========================
            EDUCATION
        ========================== */}

        <div className="profile-section">

          <label>
            🎓 Education
          </label>

          <input
            type="text"
            value={education}
            onChange={(event) =>
              setEducation(
                event.target.value
              )
            }
            placeholder="Example: MCA - SPPU"
          />

        </div>


        {/* ==========================
            SKILLS
        ========================== */}

        <div className="profile-section">

          <label>
            💻 Technical Skills
          </label>

          <textarea
            value={skills}
            onChange={(event) =>
              setSkills(
                event.target.value
              )
            }
            placeholder="Example: Java, Spring Boot, React, SQL, MySQL"
            rows="4"
          />

        </div>


        {/* ==========================
            ACCOUNT TYPE
        ========================== */}

        <div className="profile-section">

          <label>
            Account Type
          </label>

          <div className="profile-value">

            {profile?.role ===
            'JOB_SEEKER'
              ? 'Job Seeker'
              : profile?.role ===
                'RECRUITER'
                ? 'Recruiter'
                : profile?.role ||
                  'Not available'}

          </div>

        </div>


        {/* ==========================
            USER ID
        ========================== */}

        <div className="profile-section">

          <label>
            User ID
          </label>

          <div className="profile-value">

            {profile?.id ||
              'Not available'}

          </div>

        </div>


        {/* ==========================
            SAVE PROFILE
        ========================== */}

        <button
          type="button"
          className="primary-btn profile-save-btn"
          onClick={handleSaveProfile}
          disabled={saving}
        >

          {saving
            ? 'Saving...'
            : '💾 Save Profile →'}

        </button>


        {/* ==========================
            MESSAGE
        ========================== */}

        {message && (

          <div className="profile-success">

            ✓ {message}

          </div>

        )}

        {error && (

          <div className="profile-error">

            ✕ {error}

          </div>

        )}


        {/* ==========================
            RESUME SECTION
        ========================== */}

        <div className="profile-resume-section">

          <div className="profile-resume-header">

            <div>

              <h2>
                📄 My Resume
              </h2>

              <p>
                Upload your profile resume.
                PDF only, maximum 5 MB.
              </p>

            </div>

          </div>


          {/* CURRENT RESUME */}

          {profile?.resumeFileName && (

            <div className="current-resume">

              <span>
                📄
              </span>

              <div>

                <strong>
                  Current Resume
                </strong>

                <p>
                  {profile.resumeFileName}
                </p>

              </div>

            </div>

          )}


          {/* FILE INPUT */}

          <input
            type="file"
            ref={resumeInputRef}
            accept="application/pdf"
            onChange={handleResumeSelected}
          />


          {/* SELECTED FILE */}

          {resumeFile && (

            <div className="selected-profile-resume">

              Selected:
              {' '}
              <strong>
                {resumeFile.name}
              </strong>

            </div>

          )}


          {/* UPLOAD BUTTON */}

          <button
            type="button"
            className="secondary-btn"
            onClick={handleUploadResume}
            disabled={
              !resumeFile ||
              uploadingResume
            }
          >

            {uploadingResume
              ? 'Uploading...'
              : '📤 Upload / Replace Resume'}

          </button>

        </div>


        {/* SECURITY INFO */}

        <div className="profile-info">

          <span>
            🔐
          </span>

          <p>
            Your account is secured with
            JWT authentication.
          </p>

        </div>

      </div>

    </div>
  )
}

export default Profile