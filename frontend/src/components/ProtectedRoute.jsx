import { Navigate } from 'react-router-dom'

function ProtectedRoute({ children, allowedRole }) {

  const token = localStorage.getItem('token')
  const user = JSON.parse(
    localStorage.getItem('user') || 'null'
  )

  if (!token) {
    return <Navigate to="/login" replace />
  }

  if (
    allowedRole &&
    (!user || user.role !== allowedRole)
  ) {
    return <Navigate to="/" replace />
  }

  return children
}

export default ProtectedRoute