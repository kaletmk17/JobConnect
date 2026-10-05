const API_URL = `${import.meta.env.VITE_API_URL}/api/auth`

export const registerUser = async (userData) => {
  const response = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(userData)
  })

  if (!response.ok) {
    throw new Error('Registration failed')
  }

  return await response.json()
}

export const loginUser = async (loginData) => {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(loginData)
  })

  if (!response.ok) {
    throw new Error('Login failed')
  }

  return await response.json()
}