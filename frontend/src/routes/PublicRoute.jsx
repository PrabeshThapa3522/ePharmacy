import { Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

function PublicRoute({ children }) {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-sm text-slate-500">
          Loading...
        </p>
      </div>
    )
  }

  if (user) {
    return <Navigate to="/" replace />
  }

  return children
}

export default PublicRoute