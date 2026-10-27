import { useEffect, useState } from "react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import MedicineHistoryManager from "../components/MedicineHistoryManager"
function PharmacistDashboard() {
  const [prescriptions, setPrescriptions] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    const loadPrescriptions = async () => {
      try {
        const token = localStorage.getItem("access_token")

        const response = await fetch(
          "http://127.0.0.1:8000/api/prescriptions/",
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
          "Unable to connect to the server."
        )
      } finally {
        setIsLoading(false)
      }
    }

    loadPrescriptions()
  }, [])

  const reviewPrescription = async (prescriptionId, status) => {
  try {
    const token = localStorage.getItem("access_token")

    const response = await fetch(
      `http://127.0.0.1:8000/api/prescriptions/${prescriptionId}/review`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: status,
        }),
      }
    )

    const data = await response.json()

    if (!response.ok) {
      setErrorMessage(
        String(data.detail || "Failed to review prescription.")
      )
      return
    }

    setPrescriptions((currentPrescriptions) =>
      currentPrescriptions.map((prescription) =>
        prescription.id === prescriptionId
          ? data
          : prescription
      )
    )
  } catch (error) {
    setErrorMessage("Unable to connect to the server.")
  }
}
const viewPrescription = async (prescriptionId) => {
  try {
    const token = localStorage.getItem("access_token")

    const response = await fetch(
      `http://127.0.0.1:8000/api/prescriptions/${prescriptionId}/file`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    if (!response.ok) {
      setErrorMessage("Unable to open the prescription file.")
      return
    }

    const fileBlob = await response.blob()
    const fileUrl = URL.createObjectURL(fileBlob)

    window.open(fileUrl, "_blank", "noopener,noreferrer")
  } catch (error) {
    setErrorMessage("Unable to connect to the server.")
  }
}

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main>
        <section className="bg-white">
          <div className="mx-auto max-w-7xl px-6 py-16">

            <div>
              <span className="text-sm font-semibold uppercase tracking-wider text-teal-700">
                Pharmacist Dashboard
              </span>

              <h1 className="mt-3 text-4xl font-bold text-slate-900">
                Prescription Reviews
              </h1>

              <p className="mt-4 max-w-2xl leading-7 text-slate-600">
                Review submitted prescriptions and manage their approval
                status.
              </p>
            </div>

            {errorMessage && (
              <p className="mt-8 rounded-lg bg-red-50 p-4 text-sm font-medium text-red-700">
                {errorMessage}
              </p>
            )}

            {isLoading ? (
              <p className="mt-10 text-sm text-slate-500">
                Loading prescriptions...
              </p>
            ) : prescriptions.length === 0 ? (
              <div className="mt-10 rounded-xl border border-slate-200 bg-slate-50 p-8 text-center">
                <p className="font-medium text-slate-900">
                  No prescriptions found.
                </p>

                <p className="mt-2 text-sm text-slate-500">
                  Submitted prescriptions will appear here.
                </p>
              </div>
            ) : (
              <div className="mt-10 space-y-4">
                {prescriptions.map((prescription) => (
                  <div
                    key={prescription.id}
                    className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
                  >
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="font-semibold text-slate-900">
                          Prescription #{prescription.id}
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                          Customer Name: {prescription.customer_name}
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                          Submitted:{" "}
                          {new Date(
                            prescription.created_at
                          ).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex gap-3">
                      <button
                    type="button"
                      onClick={() => viewPrescription(prescription.id)}
                        className="rounded-lg bg-blue-400 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                         >
                        View Prescription
                      </button>
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

                      {prescription.status === "pending" && (
  <div className="flex gap-3">
    <button
      type="button"
      onClick={() =>
        reviewPrescription(prescription.id, "approved")
      }
      className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700"
    >
      Approve
    </button>

    <button
      type="button"
      onClick={() =>
        reviewPrescription(prescription.id, "rejected")
      }
      className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
    >
      Reject
    </button>
  </div>
)}
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        </section>
        <MedicineHistoryManager />
      </main>

      <Footer />
    </div>
  )
}

export default PharmacistDashboard