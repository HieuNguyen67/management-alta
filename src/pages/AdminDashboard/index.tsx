import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import React, { useEffect } from "react";

import { useNavigate } from "react-router-dom";
import RegisterForm from "@/components/SignUp";

const AdminDashboard: React.FC = () => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/"); 
    }
  }, [isAuthenticated, navigate]);



  return (
    <div style={{ margin: "50px 0px"}}>
      <h1 style={{ maxWidth: 400, margin: "30px auto" , textAlign: "center", color:"rgb(255, 90, 0)", fontWeight: "bold"}}>QUẢN TRỊ VIÊN</h1>

      <RegisterForm />
    </div>
  );
};

export default AdminDashboard;
