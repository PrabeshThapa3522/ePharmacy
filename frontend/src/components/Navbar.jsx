import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
function Navbar() {
  const { user, logout } = useAuth();
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        
        {/* Logo */}
        <div>
          <h1 className="text-xl font-bold text-teal-700">
            Bishwas Pharmacy
          </h1>
        </div>

        {/* Navigation */}
        <nav className="flex items-center gap-8">
          <Link 
          to="/"
            className="text-sm font-medium text-teal-700"
          >
            Home
          </Link>

          <Link
            to="/products"
            className="text-sm font-medium text-slate-600 hover:text-teal-700"
          >
            Products
          </Link>

          <Link
            to="/prescriptions"
            className="text-sm font-medium text-slate-600 hover:text-teal-700"
          >
            Prescriptions
          </Link>

 {user ? (
  <div className="flex items-center gap-4">
    <span className="text-sm font-medium text-slate-700">
      {user.full_name}
    </span>

    <button
      type="button"
      onClick={(logout)}
      className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-teal-600 hover:text-teal-700"
    >
      Logout
    </button>
  </div>
) : (
  <Link
    to="/login"
    className="rounded-lg bg-teal-700 px-5 py-2 text-sm font-medium text-white hover:bg-teal-800"
  >
    Login
  </Link>
)}
        </nav>

      </div>
    </header>
  )
}

export default Navbar

