const API_URL =
  'http://localhost:8080/api/applications'


// =========================
// APPLY FOR JOB WITH RESUME
// =========================

export const applyForJob = async (
  jobId,
  resume
) => {

  const token =
    localStorage.getItem('token')


  const formData =
    new FormData()


  // Add Job ID
  formData.append(
    'jobId',
    jobId
  )


  // Add Resume PDF
  formData.append(
    'resume',
    resume
  )


  const response = await fetch(
    `${API_URL}/apply`,
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
      'Failed to apply for job'
    )
  }


  return await response.json()
}


// =========================
// GET MY APPLICATIONS
// =========================

export const getMyApplications =
  async (userId) => {

    const token =
      localStorage.getItem('token')


    const response = await fetch(
      `${API_URL}/user/${userId}`,
      {
        method: 'GET',

        headers: {
          'Authorization':
            `Bearer ${token}`,

          'Content-Type':
            'application/json'
        }
      }
    )


    if (!response.ok) {

      throw new Error(
        'Failed to fetch applications'
      )
    }


    return await response.json()
  }


// =========================
// GET JOB APPLICATIONS
// =========================

export const getJobApplications =
  async (jobId) => {

    const token =
      localStorage.getItem('token')


    const response = await fetch(
      `${API_URL}/job/${jobId}`,
      {
        method: 'GET',

        headers: {
          'Authorization':
            `Bearer ${token}`,

          'Content-Type':
            'application/json'
        }
      }
    )


    if (!response.ok) {

      throw new Error(
        'Failed to fetch job applications'
      )
    }


    return await response.json()
  }


// =========================
// UPDATE APPLICATION STATUS
// =========================

export const updateApplicationStatus =
  async (
    applicationId,
    status
  ) => {

    const token =
      localStorage.getItem('token')


    const response = await fetch(
      `${API_URL}/${applicationId}/status?status=${status}`,
      {
        method: 'PUT',

        headers: {
          'Authorization':
            `Bearer ${token}`,

          'Content-Type':
            'application/json'
        }
      }
    )


    if (!response.ok) {

      const errorData =
        await response
          .json()
          .catch(() => null)


      throw new Error(
        errorData?.message ||
        'Failed to update application status'
      )
    }


    return await response.json()
  }