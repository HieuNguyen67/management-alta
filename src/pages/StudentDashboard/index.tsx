import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import React, { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import ExamList from "@/components/ExamList";
import ExamDetails from "@/components/ExamDetails";

const StudentDashboard: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth);
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
 const [selectedExam, setSelectedExam] = useState<{
   examId: string;
   examTitle: string;
   examDuration: number;
   examQuestions: string[];
 } | null>(null);

 const handleSelectExam = (
   examId: string,
   examTitle: string,
   examDuration: number,
   examQuestions: string[]
 ) => {
   setSelectedExam({
     examId,
     examTitle,
     examDuration,
     examQuestions,
   });
 };

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
            <span style={{ color: "black" }}>Xin chào</span> {user.name}
          </h1>
        </>
      ) : (
        <></>
      )}
      <div style={{ margin: "50px 50px" }}>
        {!selectedExam ? (
          <ExamList onSelectExam={handleSelectExam} />
        ) : (
          <ExamDetails
            examId={selectedExam.examId}
            userId={user.id}
            examTitle={selectedExam.examTitle}
            examDuration={selectedExam.examDuration}
            examQuestions={selectedExam.examQuestions}
          />
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
