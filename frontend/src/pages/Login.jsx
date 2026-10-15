import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import { useAuth } from "../context/AuthContext"
function Login() {
  const { setUser } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const handleSubmit = async (event) => {
  event.preventDefault()

  setErrorMessage("")

  try {
    const response = await fetch(
      "http://127.0.0.1:8000/api/auth/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      }
    )

    const data = await response.json()

    if (!response.ok) {
      if (Array.isArray(data.detail)){
        setErrorMessage(
          data.detail.map((error) => error.msg).join(", ")
        )
      } else{

        setErrorMessage(
          String(data.detail || "Invalid email or password.")
        )
      }
      return
    }

    localStorage.setItem("access_token", data.access_token)

const userResponse = await fetch(
  "http://127.0.0.1:8000/api/auth/me",
  {
    method: "GET",
    headers: {
      Authorization: `Bearer ${data.access_token}`,
    },
  }
)

const userData = await userResponse.json()

if (!userResponse.ok) {
  setErrorMessage("Unable to load user information.")
  return
}
setUser(userData)
console.log("Logged in user:", userData)

navigate("/")
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
                  Welcome Back
                </span>

                <h2 className="mt-3 text-3xl font-bold text-slate-900">
                  Login to your account
                </h2>

                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Access your prescriptions, orders, and pharmacy services.
                </p>
              </div>

              {errorMessage && (
                <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {errorMessage}
                </div>
          )}

              <form 
              onSubmit={handleSubmit}
              className="mt-8 space-y-5">
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
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="text-sm font-medium text-slate-700"
                    >
                      Password
                    </label>

                    <button
                      type="button"
                      className="text-sm font-medium text-teal-700 hover:text-teal-800"
                    >
                      Forgot password?
                    </button>
                  </div>

                  <input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    id="remember"
                    type="checkbox"
                    className="h-4 w-4 rounded border-slate-300 text-teal-700 focus:ring-teal-600"
                  />

                  <label
                    htmlFor="remember"
                    className="ml-2 text-sm text-slate-600"
                  >
                    Remember me
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full rounded-lg bg-teal-700 px-6 py-3 font-semibold text-white transition hover:bg-teal-800"
                >
                  Login
                </button>
              </form>

              <div className="mt-6 border-t border-slate-200 pt-6 text-center">
                <p className="text-sm text-slate-600">
                  Don't have an account?{" "}
                  <Link
                    to="/register"
                    className="font-semibold text-teal-700 hover:text-teal-800"
                  >
                    Create an account
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

export default Login