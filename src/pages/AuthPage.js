"use client"

import { useState } from "react"
import LoginForm from "../components/auth/LoginForm"
import SignupForm from "../components/auth/SignupForm"

const AuthPage = ({ onAuthSuccess }) => {
  const [activeTab, setActiveTab] = useState("login")

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-tabs">
          <button className={`auth-tab ${activeTab === "login" ? "active" : ""}`} onClick={() => setActiveTab("login")}>
            Login
          </button>
          <button
            className={`auth-tab ${activeTab === "signup" ? "active" : ""}`}
            onClick={() => setActiveTab("signup")}
          >
            Sign Up
          </button>
        </div>

        <div className="auth-content">
          {activeTab === "login" ? <LoginForm onSuccess={onAuthSuccess} /> : <SignupForm onSuccess={onAuthSuccess} />}
        </div>
      </div>
    </div>
  )
}

export default AuthPage
