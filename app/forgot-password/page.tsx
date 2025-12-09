"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess(false)

    if (!email) {
      setError("Email is required")
      setLoading(false)
      return
    }

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (data.success) {
        setSuccess(true)
      } else {
        setError(data.error || "Failed to send reset email. Please try again.")
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
            <h1>Login Credentials Sent</h1>
            <p>Check your email for your login credentials</p>
          </div>
          <div className="login-form" style={{ textAlign: "center", padding: "40px" }}>
            <div style={{ fontSize: "4rem", marginBottom: "20px" }}>📧</div>
            <h2 style={{ color: "var(--green-india)", marginBottom: "15px" }}>
              Check Your Email
            </h2>
            <p style={{ color: "var(--gray-600)", marginBottom: "20px" }}>
              We've sent your login credentials to <strong>{email}</strong>
            </p>
            <p style={{ color: "var(--gray-500)", fontSize: "0.9rem", marginBottom: "20px" }}>
              Please check your email inbox (and spam folder) for your login credentials. Use the temporary password to login and change it immediately for security.
            </p>
            <div style={{
              background: "var(--yellow-light)",
              padding: "15px",
              borderRadius: "8px",
              marginTop: "20px",
              border: "1px solid var(--yellow)",
            }}>
              <p style={{ color: "var(--gray-700)", fontSize: "0.9rem", margin: 0 }}>
                <strong>⚠️ Security Tip:</strong> After logging in, please change your password immediately for better security.
              </p>
            </div>
            <button
              onClick={() => router.push("/")}
              className="btn btn-primary btn-full"
            >
              Back to Login
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
            Forgot Password
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
            <label>Email Address *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your registered email"
            />
            <p style={{ fontSize: "0.85rem", color: "var(--gray-500)", marginTop: "8px" }}>
              We'll send your login credentials (email and temporary password) to this email address.
            </p>
          </div>

          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? "Sending..." : "Send Login Credentials"}
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

