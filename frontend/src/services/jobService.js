const API_URL = 'http://localhost:8080/api/jobs'

export const getAllJobs = async () => {

  const token = localStorage.getItem('token')

  const response = await fetch(API_URL, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })

  if (!response.ok) {
    throw new Error('Failed to fetch jobs')
  }

  return await response.json()
}
export const createJob = async (jobData) => {

  const token = localStorage.getItem('token')

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(jobData)
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => null)

    throw new Error(
      errorData?.message || 'Failed to create job'
    )
  }

  return await response.json()
}
export const getMyJobs = async () => {
  const token = localStorage.getItem('token')

  const response = await fetch(
    `${API_URL}/recruiter/my-jobs`,
    {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }
  )

  if (!response.ok) {
    throw new Error('Failed to fetch your jobs')
  }

  return await response.json()
}

export const deleteJob = async (jobId) => {
  const token = localStorage.getItem('token')

  const response = await fetch(
    `${API_URL}/${jobId}`,
    {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }
  )

  if (!response.ok) {
    throw new Error('Failed to delete job')
  }

  return await response.text()
}

export const updateJob = async (jobId, jobData) => {

  const token = localStorage.getItem('token')

  const response = await fetch(
    `${API_URL}/${jobId}`,
    {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(jobData)
    }
  )

  if (!response.ok) {

    const errorData =
      await response.json().catch(() => null)

    throw new Error(
      errorData?.message ||
      'Failed to update job'
    )
  }

  return await response.json()
}