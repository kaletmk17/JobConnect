import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

function Navbar() {

  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem('token')
  )

  const [user, setUser] = useState(() => {

    const storedUser =
      localStorage.getItem('user')

    return storedUser
      ? JSON.parse(storedUser)
      : null
  })


  useEffect(() => {

    const handleAuthChange = () => {

      const token =
        localStorage.getItem('token')

      const storedUser =
        localStorage.getItem('user')

      setIsLoggedIn(!!token)

      setUser(
        storedUser
          ? JSON.parse(storedUser)
          : null
      )
    }


    window.addEventListener(
      'authChange',
      handleAuthChange
    )


    return () => {

      window.removeEventListener(
        'authChange',
        handleAuthChange
      )

    }

  }, [])


  const handleLogout = () => {

    localStorage.removeItem('token')

    localStorage.removeItem('user')

    setIsLoggedIn(false)

    setUser(null)

    window.location.href = '/'
  }


  return (

    <nav className="navbar">

      {/* =========================
          LOGO
      ========================= */}

      <div className="logo">

        <Link to="/">

          Job<span>Connect</span>

        </Link>

      </div>


      {/* =========================
          NAVIGATION LINKS
      ========================= */}

      <div className="nav-links">

        <Link to="/">
          Home
        </Link>


        <Link to="/jobs">
          Jobs
        </Link>


        {/* =========================
            JOB SEEKER LINKS
        ========================= */}

        {isLoggedIn &&
          user?.role === 'JOB_SEEKER' && (
            <>
              <Link to="/my-applications">
                My Applications
              </Link>

              <Link to="/profile">
               My Profile
              </Link>
            </>
          )}


        {/* =========================
            RECRUITER LINKS
        ========================= */}

        {isLoggedIn &&
          user?.role === 'RECRUITER' && (

            <>

              <Link to="/post-job">
                Post Job
              </Link>

              <Link to="/my-jobs">
                My Jobs
              </Link>

              <Link to="/recruiter-applications">
                Applications
              </Link>

            </>

          )}


        {/* =========================
            USER NAME
        ========================= */}

        {isLoggedIn && user && (

          <span className="navbar-user">

            👤 {user.name}

          </span>

        )}


        {/* =========================
            LOGIN / REGISTER
        ========================= */}

        {!isLoggedIn ? (

          <>

            <Link to="/login">
              Login
            </Link>

            <Link to="/register">
              Register
            </Link>

          </>

        ) : (

          <button
            type="button"
            onClick={handleLogout}
            className="logout-btn"
          >

            Logout

          </button>

        )}

      </div>

    </nav>

  )
}

export default Navbar