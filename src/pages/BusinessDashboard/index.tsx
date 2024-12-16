import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const BusinessDashboard: React.FC = () => {
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
    <div>
      <h1 style={{ maxWidth: 400, margin: "30px auto" , textAlign: "center", color:"rgb(255, 90, 0)", fontWeight: "bold"}}>Doanh Nghiệp</h1>
     
    </div>
  );
};

export default BusinessDashboard;
    