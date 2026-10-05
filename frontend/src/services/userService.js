const API_URL = `${import.meta.env.VITE_API_URL}/api/users`

export const getUserById = async (userId) => {

  const token = localStorage.getItem('token')

  const response = await fetch(
    `${API_URL}/${userId}`,
    {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }
  )

  if (!response.ok) {
    throw new Error('Failed to fetch candidate details')
  }

  return await response.json()
}