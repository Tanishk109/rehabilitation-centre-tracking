import { Suspense } from "react"
import ResetPasswordForm from "./ResetPasswordForm"

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="login-page">
        <div className="login-container">
          <div className="login-form" style={{ textAlign: "center", padding: "40px" }}>
            <div className="stat-icon" style={{ fontSize: "4rem", marginBottom: "20px" }}>⏳</div>
            <h2 style={{ color: "var(--navy-blue)" }}>Loading...</h2>
            <p style={{ color: "var(--gray-600)" }}>Please wait</p>
          </div>
        </div>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  )
}
