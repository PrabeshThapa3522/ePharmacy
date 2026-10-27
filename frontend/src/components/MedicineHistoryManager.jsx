
import { useState } from "react"

const API_BASE = "http://127.0.0.1:8000/api/medicine-history"

function MedicineHistoryManager() {
  const [customerQuery, setCustomerQuery] = useState("")
  const [customers, setCustomers] = useState([])
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [medicineQuery, setMedicineQuery] = useState("")
  const [medicines, setMedicines] = useState([])
  const [selectedMedicine, setSelectedMedicine] = useState(null)
  const [customMedicineName, setCustomMedicineName] = useState("")
  const [strength, setStrength] = useState("")
  const [quantity, setQuantity] = useState("")
  const [recordType, setRecordType] = useState("pharmacy_supplied")
  const [notes, setNotes] = useState("")
  const [history, setHistory] = useState([])
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  const token = () => localStorage.getItem("access_token")

  const searchCustomers = async (value) => {
    setCustomerQuery(value)
    setSelectedCustomer(null)
    setHistory([])
    setError("")
    setMessage("")

    if (value.trim().length < 2) {
      setCustomers([])
      return
    }

    try {
      const response = await fetch(
        `${API_BASE}/customers/search?q=${encodeURIComponent(value.trim())}`,
        {
          headers: { Authorization: `Bearer ${token()}` },
        }
      )
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.detail || "Customer search failed.")
      }

      setCustomers(data)
    } catch (err) {
      setError(err.message || "Unable to search customers.")
    }
  }

  const loadHistory = async (customer) => {
    setSelectedCustomer(customer)
    setCustomerQuery(customer.full_name)
    setCustomers([])
    setError("")
    setMessage("")

    try {
      const response = await fetch(
        `${API_BASE}/customer/${customer.id}`,
        {
          headers: { Authorization: `Bearer ${token()}` },
        }
      )
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.detail || "Failed to load medicine history.")
      }

      setHistory(data)
    } catch (err) {
      setError(err.message || "Unable to load medicine history.")
    }
  }

  const searchMedicines = async (value) => {
    setMedicineQuery(value)
    setSelectedMedicine(null)
    setCustomMedicineName(value)
    setError("")

    if (value.trim().length < 2) {
      setMedicines([])
      return
    }

    try {
      const response = await fetch(
        `${API_BASE}/medicines/search?q=${encodeURIComponent(value.trim())}`,
        {
          headers: { Authorization: `Bearer ${token()}` },
        }
      )
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.detail || "Medicine search failed.")
      }

      setMedicines(data)
    } catch (err) {
      setError(err.message || "Unable to search medicines.")
    }
  }

  const chooseMedicine = (medicine) => {
    setSelectedMedicine(medicine)
    setMedicineQuery(medicine.name)
    setCustomMedicineName(medicine.name)
    setStrength(medicine.unit || "")
    setMedicines([])
  }

  const addRecord = async (event) => {
    event.preventDefault()
    setError("")
    setMessage("")

    const medicineName = selectedMedicine
      ? selectedMedicine.name
      : customMedicineName.trim()

    if (!selectedCustomer) {
      setError("Select a customer first.")
      return
    }

    if (!medicineName) {
      setError("Enter or select a medicine name.")
      return
    }

    setIsSaving(true)

    try {
      const response = await fetch(API_BASE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token()}`,
        },
        body: JSON.stringify({
          customer_id: selectedCustomer.id,
          product_id: selectedMedicine?.id ?? null,
          medicine_name: medicineName,
          strength: strength.trim() || null,
          quantity: quantity ? Number(quantity) : null,
          record_type: recordType,
          recorded_date: new Date().toISOString().slice(0, 10),
          notes: notes.trim() || null,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.detail || "Failed to save medicine record.")
      }

      setHistory((current) => [data, ...current])
      setMessage("Medicine record added successfully.")
      setMedicineQuery("")
      setSelectedMedicine(null)
      setCustomMedicineName("")
      setStrength("")
      setQuantity("")
      setNotes("")
      setMedicines([])
    } catch (err) {
      setError(err.message || "Unable to save medicine record.")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <section className="mt-12 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wider text-teal-700">
          Customer Records
        </p>
        <h2 className="mt-2 text-2xl font-bold text-slate-900">
          Medicine History
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Search for a regular customer to view their medicine records or add
          a new entry.
        </p>
      </div>

      {error && (
        <p role="alert" className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {message && (
        <p role="status" className="mt-5 rounded-lg bg-green-50 p-3 text-sm text-green-700">
          {message}
        </p>
      )}

      <div className="relative mt-6">
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Search customer by name or email
        </label>
        <input
          value={customerQuery}
          onChange={(event) => searchCustomers(event.target.value)}
          placeholder="Type at least 2 characters..."
          className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
        />

        {customers.length > 0 && (
          <ul className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-slate-200 bg-white shadow-lg">
            {customers.map((customer) => (
              <li key={customer.id}>
                <button
                  type="button"
                  onClick={() => loadHistory(customer)}
                  className="w-full px-4 py-3 text-left hover:bg-teal-50"
                >
                  <span className="block font-medium text-slate-900">
                    {customer.full_name}
                  </span>
                  <span className="text-sm text-slate-500">
                    {customer.email}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {selectedCustomer && (
        <>
          <div className="mt-6 rounded-lg bg-slate-50 p-4">
            <p className="font-semibold text-slate-900">
              {selectedCustomer.full_name}
            </p>
            <p className="mt-1 text-sm text-slate-500">
              {selectedCustomer.email}
            </p>
          </div>

          <form onSubmit={addRecord} className="mt-8 space-y-5">
            <h3 className="text-lg font-semibold text-slate-900">
              Add Medicine Record
            </h3>

            <div className="relative">
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Medicine name
              </label>
              <input
                value={medicineQuery}
                onChange={(event) => searchMedicines(event.target.value)}
                placeholder="Search catalogue or type a custom name..."
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
              />

              {medicines.length > 0 && (
                <ul className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-slate-200 bg-white shadow-lg">
                  {medicines.map((medicine) => (
                    <li key={medicine.id}>
                      <button
                        type="button"
                        onClick={() => chooseMedicine(medicine)}
                        className="w-full px-4 py-3 text-left hover:bg-teal-50"
                      >
                        <span className="block font-medium text-slate-900">
                          {medicine.name}
                        </span>
                        <span className="text-sm text-slate-500">
                          {[medicine.generic_name, medicine.brand_name, medicine.unit]
                            .filter(Boolean)
                            .join(" · ")}
                        </span>
                        {medicine.prescription_required && (
                          <span className="mt-1 block text-xs font-medium text-amber-700">
                            Prescription required for dispensing
                          </span>
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              <p className="mt-2 text-xs text-slate-500">
                If the medicine is not listed, enter its full name and save it
                as a custom history record.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Strength / unit
                </label>
                <input
                  value={strength}
                  onChange={(event) => setStrength(event.target.value)}
                  placeholder="e.g. 500 mg"
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-teal-600"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Quantity (optional)
                </label>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(event) => setQuantity(event.target.value)}
                  placeholder="e.g. 10"
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-teal-600"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Record source
              </label>
              <select
                value={recordType}
                onChange={(event) => setRecordType(event.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-teal-600"
              >
                <option value="pharmacy_supplied">Supplied by pharmacy</option>
                <option value="self_reported">Reported by customer</option>
                <option value="verified">Verified by pharmacist</option>
              </select>
              <p className="mt-1 text-xs text-slate-500">
                Only select verified when the record has actually been
                confirmed by an authorized pharmacist.
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Notes (optional)
              </label>
              <textarea
                rows="3"
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder="Additional information..."
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-teal-600"
              />
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="rounded-lg bg-teal-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving ? "Saving..." : "Add Medicine Record"}
            </button>
          </form>

          <div className="mt-10">
            <h3 className="text-lg font-semibold text-slate-900">
              Previous Medicine Records
            </h3>

            {history.length === 0 ? (
              <p className="mt-4 rounded-lg bg-slate-50 p-5 text-sm text-slate-500">
                No medicine history recorded for this customer yet.
              </p>
            ) : (
              <div className="mt-4 space-y-3">
                {history.map((record) => (
                  <article
                    key={record.id}
                    className="rounded-lg border border-slate-200 p-4"
                  >
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="font-semibold text-slate-900">
                          {record.medicine_name}
                        </p>
                        <p className="mt-1 text-sm text-slate-600">
                          {record.strength || "Strength not recorded"}
                          {record.quantity ? ` · Quantity: ${record.quantity}` : ""}
                        </p>
                      </div>
                      <span className="w-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                        {record.record_type.replaceAll("_", " ")}
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-slate-500">
                      Record date: {record.recorded_date || "Not specified"}
                    </p>
                    {record.notes && (
                      <p className="mt-2 text-sm text-slate-600">
                        {record.notes}
                      </p>
                    )}
                  </article>
                ))}
              </div>
            )}
          </div>

          <p className="mt-6 text-xs leading-5 text-slate-500">
            Medicine history is a reference record, not a prescription or
            authorization to dispense. Prescription requirements and pharmacist
            review still apply.
          </p>
        </>
      )}
    </section>
  )
}

export default MedicineHistoryManager
