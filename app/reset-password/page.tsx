"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"

export default function ResetPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [passwordErrors, setPasswordErrors] = useState<string[]>([])
  const [validating, setValidating] = useState(true)

  useEffect(() => {
    if (!token) {
      setError("Invalid or missing reset token")
      setValidating(false)
      return
    }

    // Validate token
    const validateToken = async () => {
      try {
        const response = await fetch(`/api/auth/verify-reset-token?token=${encodeURIComponent(token)}`)
        const data = await response.json()
        
        if (!data.success) {
          setError(data.error || "Invalid or expired reset token")
        }
      } catch (err) {
        setError("Failed to validate reset token")
      } finally {
        setValidating(false)
      }
    }

    validateToken()
  }, [token])

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

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          password: formData.password,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setSuccess(true)
        setTimeout(() => {
          router.push("/")
        }, 3000)
      } else {
        setError(data.error || "Failed to reset password. Please try again.")
      }
    } catch (err) {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (validating) {
    return (
      <div className="login-page">
        <div className="login-container">
          <div className="login-form" style={{ textAlign: "center", padding: "40px" }}>
            <div className="stat-icon" style={{ fontSize: "4rem", marginBottom: "20px" }}>⏳</div>
            <h2 style={{ color: "var(--navy-blue)" }}>Validating...</h2>
            <p style={{ color: "var(--gray-600)" }}>Please wait while we verify your reset link</p>
          </div>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="login-page">
        <div className="login-container">
          <div className="login-header">
            <div className="emblem">
              <div className="ashoka-chakra"></div>
            </div>
            <h1>Password Reset</h1>
            <p>Your password has been reset successfully</p>
          </div>
          <div className="login-form" style={{ textAlign: "center", padding: "40px" }}>
            <div style={{ fontSize: "4rem", marginBottom: "20px" }}>✅</div>
            <h2 style={{ color: "var(--green-india)", marginBottom: "15px" }}>
              Password Reset Successful
            </h2>
            <p style={{ color: "var(--gray-600)", marginBottom: "20px" }}>
              Your password has been reset successfully. You can now login with your new password.
            </p>
            <p style={{ color: "var(--gray-500)", fontSize: "0.9rem" }}>
              Redirecting to login page...
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (error && !token) {
    return (
      <div className="login-page">
        <div className="login-container">
          <div className="login-form" style={{ textAlign: "center", padding: "40px" }}>
            <div style={{ fontSize: "4rem", marginBottom: "20px" }}>❌</div>
            <h2 style={{ color: "var(--red)", marginBottom: "15px" }}>
              Invalid Reset Link
            </h2>
            <p style={{ color: "var(--gray-600)", marginBottom: "20px" }}>
              {error}
            </p>
            <button
              onClick={() => router.push("/forgot-password")}
              className="btn btn-primary btn-full"
            >
              Request New Reset Link
            </button>
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
            Reset Password
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
            <label>New Password *</label>
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
            <label>Confirm New Password *</label>
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

          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? "Resetting..." : "Reset Password"}
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

