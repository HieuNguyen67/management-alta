import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import React, { useEffect } from "react";

import { useNavigate } from "react-router-dom";
import FormLearningProcess from "@/components/FormLearningProcess";

const LearningProcess: React.FC = () => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
    const user = useSelector((state: RootState) => state.auth);

  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);
  return (
    <>
      <div style={{ margin: "50px 50px" }}>
        {isAuthenticated && user ? (
          <>
            <h1
              style={{
                margin: "30px 20px",

                color: "rgb(255, 90, 0)",
                fontWeight: "bold",
              }}
            >
              <span style={{ color: "black" }}>Xin chào</span> {user.name}
            </h1>
          </>
        ) : (
          <></>
        )}
        <FormLearningProcess/>  
      </div>
    </>
  );
};
export default LearningProcess;
