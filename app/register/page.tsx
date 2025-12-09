"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    centreName: "",
    centreAddress: "",
    centreState: "",
    centreCity: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [passwordErrors, setPasswordErrors] = useState<string[]>([])

  const INDIAN_STATES = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
    "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
    "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
    "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
    "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi",
  ]

  const validatePassword = (password: string): string[] => {
    const errors: string[] = []
    if (password.length < 8) {
      errors.push("Password must be at least 8 characters long")
    }
    if (!/[A-Z]/.test(password)) {
      errors.push("Password must contain at least one uppercase letter")
    }
    if (!/[a-z]/.test(password)) {
      errors.push("Password must contain at least one lowercase letter")
    }
    if (!/[0-9]/.test(password)) {
      errors.push("Password must contain at least one number")
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push("Password must contain at least one special character")
    }
    return errors
  }

  const handlePasswordChange = (value: string) => {
    setFormData({ ...formData, password: value })
    if (value) {
      setPasswordErrors(validatePassword(value))
    } else {
      setPasswordErrors([])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess(false)

    // Validate password
    if (!formData.password) {
      setError("Password is required")
      setLoading(false)
      return
    }

    const passwordValidationErrors = validatePassword(formData.password)
    if (passwordValidationErrors.length > 0) {
      setError("Please fix password requirements")
      setLoading(false)
      return
    }

    // Check password match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }

    try {
      const { confirmPassword, ...submitData } = formData
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      })

      const data = await response.json()

      if (data.success) {
        setSuccess(true)
        setTimeout(() => {
          router.push("/")
        }, 3000)
      } else {
        setError(data.error || "Registration failed. Please try again.")
      }
    } catch (err) {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="login-page">
        <div className="login-container">
          <div className="login-header">
            <div className="emblem">
              <div className="ashoka-chakra"></div>
            </div>
            <h1>Registration Submitted</h1>
            <p>Your registration has been submitted successfully</p>
          </div>
          <div className="login-form" style={{ textAlign: "center", padding: "40px" }}>
            <div style={{ fontSize: "4rem", marginBottom: "20px" }}>✅</div>
            <h2 style={{ color: "var(--green-india)", marginBottom: "15px" }}>
              Registration Pending Approval
            </h2>
            <p style={{ color: "var(--gray-600)", marginBottom: "20px" }}>
              Your registration request has been submitted. The super admin will review and approve your request.
            </p>
            <p style={{ color: "var(--gray-500)", fontSize: "0.9rem" }}>
              You will be redirected to the login page shortly...
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <div className="emblem">
            <div className="ashoka-chakra"></div>
          </div>
          <h1>NRCMS</h1>
          <p>National Rehabilitation Centre Management System</p>
          <span className="govt-text">Government of India</span>
        </div>
        <form onSubmit={handleSubmit} className="login-form">
          <h2 style={{ marginBottom: "20px", color: "var(--navy-blue)", textAlign: "center" }}>
            Centre Admin Registration
          </h2>

          {error && (
            <div style={{
              padding: "12px",
              background: "var(--red-light)",
              color: "var(--red)",
              borderRadius: "var(--radius)",
              marginBottom: "20px",
              fontSize: "0.9rem",
            }}>
              {error}
            </div>
          )}

          <div className="form-group">
            <label>Full Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              placeholder="Enter your full name"
            />
          </div>

          <div className="form-group">
            <label>Email Address *</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label>Phone Number *</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
              placeholder="Enter your phone number"
            />
          </div>

          <div className="form-group">
            <label>Password *</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => handlePasswordChange(e.target.value)}
              required
              placeholder="Enter a strong password"
            />
            {passwordErrors.length > 0 && (
              <div style={{
                marginTop: "8px",
                fontSize: "0.85rem",
                color: "var(--red)",
              }}>
                <div style={{ fontWeight: "bold", marginBottom: "4px" }}>Password must:</div>
                <ul style={{ margin: 0, paddingLeft: "20px" }}>
                  {passwordErrors.map((err, idx) => (
                    <li key={idx}>
                      {err}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {formData.password && passwordErrors.length === 0 && (
              <div style={{
                marginTop: "8px",
                fontSize: "0.85rem",
                color: "var(--green-india)",
              }}>
                ✓ Password meets all requirements
              </div>
            )}
          </div>

          <div className="form-group">
            <label>Confirm Password *</label>
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              required
              placeholder="Confirm your password"
            />
            {formData.confirmPassword && formData.password !== formData.confirmPassword && (
              <div style={{
                marginTop: "8px",
                fontSize: "0.85rem",
                color: "var(--red)",
              }}>
                Passwords do not match
              </div>
            )}
            {formData.confirmPassword && formData.password === formData.confirmPassword && (
              <div style={{
                marginTop: "8px",
                fontSize: "0.85rem",
                color: "var(--green-india)",
              }}>
                ✓ Passwords match
              </div>
            )}
          </div>

          <div className="form-group">
            <label>Centre Name *</label>
            <input
              type="text"
              value={formData.centreName}
              onChange={(e) => setFormData({ ...formData, centreName: e.target.value })}
              required
              placeholder="Enter rehabilitation centre name"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>State *</label>
              <select
                value={formData.centreState}
                onChange={(e) => setFormData({ ...formData, centreState: e.target.value })}
                required
              >
                <option value="">Select State</option>
                {INDIAN_STATES.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>City *</label>
              <input
                type="text"
                value={formData.centreCity}
                onChange={(e) => setFormData({ ...formData, centreCity: e.target.value })}
                required
                placeholder="Enter city"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Centre Address *</label>
            <textarea
              value={formData.centreAddress}
              onChange={(e) => setFormData({ ...formData, centreAddress: e.target.value })}
              required
              rows={3}
              placeholder="Enter complete address"
            />
          </div>

          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? "Submitting..." : "Submit Registration"}
          </button>

          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <a
              href="/"
              style={{
                color: "var(--navy-blue)",
                textDecoration: "none",
                fontSize: "0.9rem",
              }}
            >
              ← Back to Login
            </a>
          </div>
        </form>
      </div>
    </div>
  )
}

