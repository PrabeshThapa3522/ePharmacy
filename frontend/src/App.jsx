import { BrowserRouter, Routes, Route } from "react-router-dom"
import React from "react";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Prescriptions from "./pages/Prescriptions"; 
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./routes/ProtectedRoute";
import PublicRoute from "./routes/PublicRoute";
import PharmacistDashboard from "./pages/PharmacistDashboard"
import RoleRoute from "./routes/RoleRoute"
function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/products" element={<Products />}/>
      <Route path="/products/:id" element={<ProductDetails />} />
      <Route path="/prescriptions" element={
        <ProtectedRoute>
          <Prescriptions />
        </ProtectedRoute>
      } />
      <Route path="/login" element={
        <PublicRoute>
          <Login />
        </PublicRoute>
      } />
      <Route path="/register" element={
        <PublicRoute>
          <Register />
        </PublicRoute>
      } />

    

      <Route
        path="/pharmacist"
        element={
          <RoleRoute allowedRoles={["pharmacist", "admin"]}>
            <PharmacistDashboard />
          </RoleRoute>
          }
        />

     </Routes>
    </BrowserRouter>
  )
  
}

export default App

