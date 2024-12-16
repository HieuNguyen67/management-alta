import { Route, Routes } from "react-router-dom";
import NotFound from "../../pages/NotFound";
import Home from "../../pages/Home";
import React, { useEffect } from "react";
import { useAppDispatch } from "@/redux/hook/hook";
import { loginSuccess } from "@/redux/slices/authSlice";
import ProtectedRoute from "./ProtectedRoute";
import BusinessDashboard from "@/pages/BusinessDashboard";
import StudentDashboard from "@/pages/StudentDashboard";
import AdminDashboard from "@/pages/AdminDashboard";

const Apps: React.FC = () => {

    const dispatch = useAppDispatch();

    useEffect(() => {
      const storedUser = localStorage.getItem("authUser");
      if (storedUser) {
        const user = JSON.parse(storedUser);
        if (user.isAuthenticated) {
          dispatch(loginSuccess({ email: user.email, role: user.role }));
        }
      }
    }, [dispatch]);
  return (
    <>
      <Routes>
        <Route path="*" element={<NotFound />} />
        <Route path="/" element={<Home />} />
        <Route
          path="/business-dashboard"
          element={
            <ProtectedRoute allowedRoles={["business"]}>
              <BusinessDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student-dashboard"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/unauthorized" element={<div>Unauthorized</div>} />
      </Routes>
    </>
  );
};

export default Apps;
