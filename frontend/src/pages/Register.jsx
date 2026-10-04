import { useState } from 'react'
import { registerUser } from '../services/authService'

function Register() {

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('JOB_SEEKER')

  const handleRegister = async (event) => {
    event.preventDefault()

    try {

      const userData = {
        name,
        email,
        password,
        role
      }

      const response = await registerUser(userData)

      console.log('Registration successful:', response)

      alert('Registration successful! You can now login.')

      setName('')
      setEmail('')
      setPassword('')
      setRole('JOB_SEEKER')

    } catch (error) {

      console.error('Registration error:', error)

      alert('Registration failed. Please try again.')
    }
  }

  return (
    <div className="auth-container">

      <div className="auth-card">

        <h2>Create JobConnect Account</h2>

        <form onSubmit={handleRegister}>

          <div className="form-group">
            <label>Name</label>

            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </div>

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
              placeholder="Create a password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Register As</label>

            <select
              value={role}
              onChange={(event) => setRole(event.target.value)}
            >
              <option value="JOB_SEEKER">
                Job Seeker
              </option>

              <option value="RECRUITER">
                Recruiter
              </option>
            </select>
          </div>

          <button
            type="submit"
            className="primary-btn login-btn"
          >
            Register
          </button>

        </form>

      </div>

    </div>
  )
}

export default Register