
import { useState, useEffect } from "react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

function Prescriptions() {
  const [file, setFile] = useState(null)
  const [message, setMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const[prescriptions, setPrescriptions] = useState([])
  const[isLoading, setIsLoading] = useState(true)

  useEffect(() => {
  const loadPrescriptions = async () => {
    try {
      const token = localStorage.getItem("access_token")

      const response = await fetch(
        "http://127.0.0.1:8000/api/prescriptions/my",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data = await response.json()

      if (!response.ok) {
        setErrorMessage(
          String(data.detail || "Failed to load prescriptions.")
        )
        return
      }

      setPrescriptions(data)
    } catch (error) {
      setErrorMessage(
        "Unable to load prescriptions."
      )
    } finally {
      setIsLoading(false)
    }
  }

  loadPrescriptions()
}, [])



  const handleFileChange = (event) => {
    setFile(event.target.files[0])
    setMessage("")
    setErrorMessage("")
  }

  const handleSubmit = async () => {
    if (!file) {
      return
    }

    setMessage("")
    setErrorMessage("")
    setIsSubmitting(true)

    try {
      const token = localStorage.getItem("access_token")

      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch(
        "http://127.0.0.1:8000/api/prescriptions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      )

      const data = await response.json()

      if (!response.ok) {
        setErrorMessage(
          String(data.detail || "Failed to submit prescription.")
        )
        return
      }

      setMessage("Prescription submitted successfully.")
      setFile(null)

    } catch (error) {
      setErrorMessage(
        "Unable to connect to the server. Please try again."
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main>
        <section className="bg-white">
          <div className="mx-auto max-w-4xl px-6 py-16">

            {/* Page Header */}
            <div className="text-center">
              <span className="text-sm font-semibold uppercase tracking-wider text-teal-700">
                Prescription Service
              </span>

              <h2 className="mt-3 text-4xl font-bold text-slate-900">
                Upload your prescription
              </h2>

              <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-600">
                Upload a clear image or PDF of your prescription. A qualified
                pharmacist will review it before approval.
              </p>
            </div>

            {/* Upload Card */}
            <div className="mt-12 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">

              <label
                htmlFor="prescription"
                className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-14 text-center transition hover:border-teal-500 hover:bg-teal-50"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-teal-100 text-3xl">
                  📄
                </div>

                <h3 className="mt-5 text-lg font-semibold text-slate-900">
                  Choose your prescription
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  Upload JPG, PNG, or PDF files
                </p>

                <span className="mt-5 rounded-lg bg-teal-700 px-5 py-2.5 text-sm font-medium text-white">
                  Select File
                </span>

                <input
                  id="prescription"
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>

              {/* Selected File */}
              {file && (
                <div className="mt-6 flex items-center justify-between rounded-lg bg-teal-50 p-4">
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      {file.name}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setFile(null)}
                    className="text-sm font-medium text-red-600 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              )}

              {/* Success Message */}
              {message && (
                <p className="mt-4 rounded-lg bg-green-50 p-3 text-sm font-medium text-green-700">
                  {message}
                </p>
              )}

              {/* Error Message */}
              {errorMessage && (
                <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm font-medium text-red-700">
                  {errorMessage}
                </p>
              )}

              {/* Submit */}
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!file || isSubmitting}
                className="mt-6 w-full rounded-lg bg-teal-700 px-6 py-3 font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                {isSubmitting
                  ? "Submitting..."
                  : "Submit Prescription"}
              </button>

            </div>

            {/* Information */}
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              

              <div className="rounded-xl bg-slate-50 p-5">
                <p className="font-semibold text-slate-900">
                  1. Upload
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Upload a clear prescription image or PDF.
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-5">
                <p className="font-semibold text-slate-900">
                  2. Pharmacist Review
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  A pharmacist reviews the submitted prescription.
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-5">
                <p className="font-semibold text-slate-900">
                  3. Approval
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  You can check whether your prescription was approved or
                  rejected.
                </p>
              </div>

            </div>

            {/* My Prescriptions */}
<div className="mt-12">
  <h3 className="text-xl font-bold text-slate-900">
    My Prescriptions
  </h3>

  {isLoading ? (
    <p className="mt-4 text-sm text-slate-500">
      Loading prescriptions...
    </p>
  ) : prescriptions.length === 0 ? (
    <p className="mt-4 text-sm text-slate-500">
      You have not submitted any prescriptions yet.
    </p>
  ) : (
    <div className="mt-4 space-y-4">
      {prescriptions.map((prescription) => (
        <div
          key={prescription.id}
          className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-semibold text-slate-900">
                Prescription #{prescription.id}
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Submitted on{" "}
                {new Date(
                  prescription.created_at
                ).toLocaleString()}
              </p>
            </div>

            <span
              className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${
                prescription.status === "approved"
                  ? "bg-green-100 text-green-700"
                  : prescription.status === "rejected"
                  ? "bg-red-100 text-red-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {prescription.status.charAt(0).toUpperCase() +
                prescription.status.slice(1)}
            </span>
          </div>
        </div>
      ))}
    </div>
  )}
</div>

          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default Prescriptions

