import { useNavigate } from 'react-router-dom'

function Home() {

  const navigate = useNavigate()

  /* =================================
     FIND JOBS
     ================================= */

  const handleFindJobs = () => {

    const token = localStorage.getItem('token')

    if (token) {
      navigate('/jobs')
    } else {
      navigate('/login')
    }
  }


  /* =================================
     POST JOB
     ================================= */

  const handlePostJob = () => {

    const token = localStorage.getItem('token')

    const user = JSON.parse(
      localStorage.getItem('user') || 'null'
    )

    if (!token) {
      navigate('/login')
      return
    }

    if (user?.role === 'RECRUITER') {
      navigate('/post-job')
    } else {
      alert('Only recruiters can post jobs.')
    }
  }


  /* =================================
     LOGIN
     ================================= */

  const handleLogin = () => {
    navigate('/login')
  }


  /* =================================
     REGISTER
     ================================= */

  const handleRegister = () => {
    navigate('/register')
  }


  return (

    <main>


      {/* =================================
          HERO SECTION
          ================================= */}

      <section className="hero-section">

        {/* Background decoration */}

        <div className="hero-background-circle circle-one"></div>

        <div className="hero-background-circle circle-two"></div>


        <div className="hero-content">


          {/* Badge */}

          <div className="hero-badge">
            🚀 Your Career Starts Here
          </div>


          {/* Subtitle */}

          <p className="hero-subtitle">
            ✨ Discover opportunities. Build your future.
          </p>


          {/* Main Heading */}

          <h1>
            Find Your <span>Dream Job</span>
          </h1>


          {/* Description */}

          <p className="hero-description">

            Discover exciting career opportunities,
            connect with companies, and take the
            next step toward your future with
            JobConnect.

          </p>


          {/* Hero Buttons */}

          <div className="hero-buttons">

            <button
              className="primary-btn"
              onClick={handleFindJobs}
            >
              🔍 Find Jobs
            </button>


            <button
              className="secondary-btn"
              onClick={handlePostJob}
            >
              🏢 Post a Job
            </button>

          </div>


          {/* =================================
              STATISTICS
              ================================= */}

          <div className="hero-stats">


            <div className="stat-card">

              <strong>
                100+
              </strong>

              <span>
                Job Opportunities
              </span>

            </div>


            <div className="stat-card">

              <strong>
                50+
              </strong>

              <span>
                Companies
              </span>

            </div>


            <div className="stat-card">

              <strong>
                24/7
              </strong>

              <span>
                Career Access
              </span>

            </div>


          </div>

        </div>

      </section>


      {/* =================================
          HOW JOBCONNECT WORKS
          ================================= */}

      <section className="how-it-works">


        <div className="section-heading">


          <span className="section-label">
            SIMPLE PROCESS
          </span>


          <h2>
            How JobConnect Works
          </h2>


          <p>
            Start your career journey in just
            a few simple steps.
          </p>


        </div>


        <div className="steps-container">


          {/* Step 01 */}

          <div className="step-card">

            <div className="step-number">
              01
            </div>


            <div className="step-icon">
              👤
            </div>


            <h3>
              Create Account
            </h3>


            <p>
              Register as a Job Seeker and create
              your JobConnect account.
            </p>

          </div>


          {/* Step 02 */}

          <div className="step-card">

            <div className="step-number">
              02
            </div>


            <div className="step-icon">
              🔍
            </div>


            <h3>
              Find Your Job
            </h3>


            <p>
              Search jobs by title, company,
              location, and skills.
            </p>

          </div>


          {/* Step 03 */}

          <div className="step-card">

            <div className="step-number">
              03
            </div>


            <div className="step-icon">
              📄
            </div>


            <h3>
              Apply Easily
            </h3>


            <p>
              Apply for suitable jobs and track
              your applications.
            </p>

          </div>


          {/* Step 04 */}

          <div className="step-card">

            <div className="step-number">
              04
            </div>


            <div className="step-icon">
              🚀
            </div>


            <h3>
              Grow Your Career
            </h3>


            <p>
              Connect with companies and move
              toward your career goals.
            </p>

          </div>


        </div>

      </section>


      {/* =================================
          JOB SEEKER / RECRUITER
          ================================= */}

      <section className="role-section">


        <div className="section-heading">


          <span className="section-label">
            BUILT FOR EVERYONE
          </span>


          <h2>
            What Can You Do With JobConnect?
          </h2>


          <p>
            Whether you're looking for talent or
            your next opportunity, JobConnect
            has you covered.
          </p>


        </div>


        <div className="role-container">


          {/* =================================
              JOB SEEKER
              ================================= */}

          <div className="role-card seeker-card">


            <div className="role-icon">
              👨‍💻
            </div>


            <h3>
              For Job Seekers
            </h3>


            <p>
              Find opportunities that match your
              skills and career goals.
            </p>


            <ul>

              <li>
                ✓ Search and filter jobs
              </li>

              <li>
                ✓ Apply for jobs
              </li>

              <li>
                ✓ Track applications
              </li>

              <li>
                ✓ View application status
              </li>

            </ul>


            {/* Login + Create Account */}

            <div className="role-buttons">


              <button
                className="primary-btn"
                onClick={handleLogin}
              >
                🔐 Login
              </button>


              <button
                className="secondary-btn"
                onClick={handleRegister}
              >
                📝 Create Account
              </button>


            </div>

          </div>


          {/* =================================
              RECRUITER
              ================================= */}

          <div className="role-card recruiter-card">


            <div className="role-icon">
              🏢
            </div>


            <h3>
              For Recruiters
            </h3>


            <p>
              Find talented candidates and manage
              your hiring process easily.
            </p>


            <ul>

              <li>
                ✓ Post job opportunities
              </li>

              <li>
                ✓ Manage your jobs
              </li>

              <li>
                ✓ View applications
              </li>

              <li>
                ✓ Accept or reject candidates
              </li>

            </ul>


            {/* Login + Create Account */}

            <div className="role-buttons">


              <button
                className="primary-btn"
                onClick={handleLogin}
              >
                🔐 Login
              </button>


              <button
                className="secondary-btn"
                onClick={handleRegister}
              >
                📝 Create Account
              </button>


            </div>

          </div>


        </div>

      </section>


      {/* =================================
          WHY JOBCONNECT
          ================================= */}

      <section className="features">


        <div className="section-heading">


          <span className="section-label">
            WHY JOBCONNECT
          </span>


          <h2>
            Everything You Need
          </h2>


          <p>
            A simple platform connecting talented
            people with great opportunities.
          </p>


        </div>


        <div className="feature-container">


          {/* Feature 1 */}

          <div className="feature-card">

            <div className="feature-icon">
              🔎
            </div>


            <h3>
              Smart Job Search
            </h3>


            <p>
              Quickly find jobs based on title,
              skills, and location.
            </p>

          </div>


          {/* Feature 2 */}

          <div className="feature-card">

            <div className="feature-icon">
              📄
            </div>


            <h3>
              Easy Applications
            </h3>


            <p>
              Apply for jobs and keep track of
              your application status.
            </p>

          </div>


          {/* Feature 3 */}

          <div className="feature-card">

            <div className="feature-icon">
              🔐
            </div>


            <h3>
              Secure Authentication
            </h3>


            <p>
              Role-based access with secure
              JWT authentication.
            </p>

          </div>


          {/* Feature 4 */}

          <div className="feature-card">

            <div className="feature-icon">
              ⚡
            </div>


            <h3>
              Simple & Fast
            </h3>


            <p>
              A clean and simple experience
              for candidates and recruiters.
            </p>

          </div>


        </div>

      </section>


      {/* =================================
          CALL TO ACTION
          ================================= */}

      <section className="cta-section">


        <div className="cta-content">


          <div className="cta-icon">
            🚀
          </div>


          <h2>
            Ready to Take the Next Step?
          </h2>


          <p>
            Create your account and start exploring
            career opportunities today.
          </p>


          <button
            className="primary-btn cta-btn"
            onClick={handleRegister}
          >
            Get Started →
          </button>


        </div>

      </section>


      {/* =================================
          FOOTER
          ================================= */}

      <footer className="footer">


        <div className="footer-content">


          {/* Footer Brand */}

          <div className="footer-brand">


            <h3>
              💼 Job<span>Connect</span>
            </h3>


            <p>
              Connect. Discover. Grow.
            </p>


          </div>


          {/* Social Media */}

          <div className="footer-social">


            <h4>
              Connect With Us
            </h4>


            <div className="social-links">


              {/* =================================
                  INSTAGRAM
                  ================================= */}

              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >

                <svg
                  viewBox="0 0 24 24"
                  className="social-icon"
                >

                  <rect
                    x="3"
                    y="3"
                    width="18"
                    height="18"
                    rx="5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  />

                  <circle
                    cx="12"
                    cy="12"
                    r="4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  />

                  <circle
                    cx="17.5"
                    cy="6.5"
                    r="1"
                    fill="currentColor"
                  />

                </svg>

              </a>


              {/* =================================
                  GITHUB
                  ================================= */}

              <a
                href="https://github.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
              >

                <svg
                  viewBox="0 0 24 24"
                  className="social-icon"
                  fill="currentColor"
                >

                  <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.57.1.78-.25.78-.55v-2.13c-3.2.7-3.87-1.36-3.87-1.36-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.68 1.25 3.33.96.1-.74.4-1.25.73-1.54-2.55-.29-5.23-1.28-5.23-5.69 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.47.11-3.06 0 0 .96-.31 3.15 1.18A10.9 10.9 0 0 1 12 6.06c.97 0 1.94.13 2.85.38 2.19-1.49 3.15-1.18 3.15-1.18.62 1.59.23 2.77.11 3.06.73.81 1.18 1.84 1.18 3.1 0 4.42-2.69 5.39-5.25 5.68.41.35.78 1.04.78 2.1v3.11c0 .3.21.65.79.54A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />

                </svg>

              </a>


              {/* =================================
                  LINKEDIN
                  ================================= */}

              <a
                href="https://www.linkedin.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >

                <svg
                  viewBox="0 0 24 24"
                  className="social-icon"
                  fill="currentColor"
                >

                  <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.35V8.98h3.42v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.61 0 4.28 2.37 4.28 5.46v6.3ZM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14ZM3.56 20.45h3.56V8.98H3.56v11.47ZM22.22 0H1.77C.79 0 0 .78 0 1.75v20.5C0 23.22.79 24 1.77 24h20.45C23.21 24 24 23.22 24 22.25V1.75C24 .78 23.21 0 22.22 0Z" />

                </svg>

              </a>


              {/* =================================
                  X
                  ================================= */}

              <a
                href="https://x.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X"
              >

                <svg
                  viewBox="0 0 24 24"
                  className="social-icon"
                  fill="currentColor"
                >

                  <path d="M18.9 2H22l-6.77 7.74L23.2 22h-6.25l-4.9-6.41L6.45 22H3.33l7.24-8.28L2.8 2h6.4l4.43 5.86L18.9 2Zm-1.1 17.86h1.73L8.26 4.04H6.4L17.8 19.86Z" />

                </svg>

              </a>


            </div>

          </div>


        </div>


        {/* Footer Bottom */}

        <div className="footer-bottom">

          <p>
            © 2026 JobConnect. All rights reserved.
          </p>

          <p>
            Built with ❤️ using Java & React
          </p>

        </div>


      </footer>


    </main>
  )
}

export default Home