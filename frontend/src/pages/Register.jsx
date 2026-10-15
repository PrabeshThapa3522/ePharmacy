import { useState } from "react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { Link, useNavigate } from "react-router-dom"
import { Eye, EyeOff } from "lucide-react"

function Register() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [errorMessage, setErrorMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")

  const handleChange = (event) => {
    const { id, value } = event.target

    if (id === "phone") {
      const phoneNumber = value.replace(/\D/g, "")

      if (phoneNumber.length > 10) {
        return
      }

      setFormData({
        ...formData,
        phone: phoneNumber,
      })

      return
    }

    setFormData({
      ...formData,
      [id]: value,
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    setErrorMessage("")
    setSuccessMessage("")

    if (formData.phone.length !== 10) {
      setErrorMessage("Phone number must be exactly 10 digits.")
      return
    }

    if (formData.password.length < 8) {
      setErrorMessage("Password must be at least 8 characters.")
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match.")
      return
    }

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            full_name: formData.full_name,
            email: formData.email,
            password: formData.password,
            phone: formData.phone,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        setErrorMessage(data.detail || "Registration failed.")
        return
      }

      setSuccessMessage(
        "Your account has been created successfully. Redirecting to login..."
      )

      setTimeout(() => {
        navigate("/login")
      }, 4000)
    } catch (error) {
      setErrorMessage(
        "Unable to connect to the server. Please try again."
      )
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main>
        <section className="flex min-h-[calc(100vh-128px)] items-center bg-slate-50">
          <div className="mx-auto w-full max-w-md px-6 py-16">
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
              <div className="text-center">
                <span className="text-sm font-semibold uppercase tracking-wider text-teal-700">
                  Get Started
                </span>

                <h2 className="mt-3 text-3xl font-bold text-slate-900">
                  Create your account
                </h2>

                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Create an account to manage your pharmacy services and
                  prescriptions.
                </p>
              </div>

              {errorMessage && (
                <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {errorMessage}
                </div>
              )}

              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                {/* Full Name */}
                <div>
                  <label
                    htmlFor="full_name"
                    className="text-sm font-medium text-slate-700"
                  >
                    Full Name
                  </label>

                  <input
                    id="full_name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.full_name}
                    onChange={handleChange}
                    required
                    className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                  />
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="text-sm font-medium text-slate-700"
                  >
                    Email Address
                  </label>

                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label
                    htmlFor="phone"
                    className="text-sm font-medium text-slate-700"
                  >
                    Phone Number
                  </label>

                  <input
                    id="phone"
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    placeholder="Enter 10-digit phone number"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                  />

                  <p className="mt-1.5 text-xs text-slate-500">
                    {formData.phone.length}/10 digits
                  </p>
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="text-sm font-medium text-slate-700"
                  >
                    Password
                  </label>

                  <div className="relative mt-2">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="w-full rounded-lg border border-slate-300 px-4 py-3 pr-12 text-sm outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-teal-700"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>

                  <p className="mt-1.5 text-xs text-slate-500">
                    Minimum 8 characters
                  </p>
                </div>

                {/* Confirm Password */}
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="text-sm font-medium text-slate-700"
                  >
                    Confirm Password
                  </label>

                  <div className="relative mt-2">
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      className="w-full rounded-lg border border-slate-300 px-4 py-3 pr-12 text-sm outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-teal-700"
                      aria-label={
                        showConfirmPassword
                          ? "Hide confirm password"
                          : "Show confirm password"
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Create Account */}
                <button
                  type="submit"
                  disabled={!!successMessage}
                  className="w-full rounded-lg bg-teal-700 px-6 py-3 font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Create Account
                </button>

                {/* Success Message */}
                {successMessage && (
                  <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                    <div className="flex items-start gap-2">
                      <span className="font-semibold">✓</span>
                      <span>{successMessage}</span>
                    </div>
                  </div>
                )}
              </form>

              <div className="mt-6 border-t border-slate-200 pt-6 text-center">
                <p className="text-sm text-slate-600">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="font-semibold text-teal-700 hover:text-teal-800"
                  >
                    Login
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default Register

