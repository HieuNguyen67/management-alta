import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import React, { useEffect } from "react";

import { useNavigate } from "react-router-dom";

const StudentDashboard: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth);
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
      {isAuthenticated && user ? (
        <>
          <h1
            style={{
              margin: "30px auto",
              textAlign: "center",
              color: "rgb(255, 90, 0)",
              fontWeight: "bold",
            }}
          >
            <span style={{color: "black"}}>Xin chào</span> {user.email}!
          </h1>
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default StudentDashboard;
