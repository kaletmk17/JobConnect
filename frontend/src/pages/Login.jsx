import { useState } from 'react'
import { loginUser } from '../services/authService'

function Login() {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const loginData = {
        email,
        password
      }

      const response = await loginUser(loginData)

      console.log('Login successful:', response)

      localStorage.setItem('token', response.token)
      localStorage.setItem(
        'user',
        JSON.stringify({
          id: response.userId,
          name: response.name,
          email: response.email,
          role: response.role
        })
      )

      window.dispatchEvent(new Event('authChange'))

      alert('Login successful!')

      window.location.href = '/'

    } catch (error) {
      console.error('Login error:', error)
      alert('Invalid email or password.')
    }
  }

  return (
    <div className="auth-container">

      <div className="auth-card">

        <h2>Login to JobConnect</h2>

        <form onSubmit={handleLogin}>

          <div className="form-group">
            <label>Email</label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="primary-btn login-btn"
          >
            Login
          </button>

        </form>

      </div>

    </div>
  )
}

export default Login