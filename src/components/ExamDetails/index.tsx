import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hook/hook";
import { fetchQuestionsByExamId } from "@/redux/slices/questionsSlice";
import { submitAnswers } from "@/redux/slices/userAnswersSlice";
import { db } from "@/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { Button, Modal, Radio, Progress, Typography, Space } from "antd";
import { useNavigate } from "react-router-dom";

const { Title, Paragraph } = Typography;

const ExamDetails = ({
  examId,
  userId,
  examTitle,
  examDuration,
  examQuestions,
}: {
  examId: string;
  userId: string;
  examTitle: string;
  examDuration: number; 
  examQuestions: string[];
}) => {
  const dispatch = useAppDispatch();
  const { questions, loading } = useAppSelector((state) => state.questions);
  const [answers, setAnswers] = useState<any[]>([]);
  const [timeLeft, setTimeLeft] = useState(examDuration * 60); 
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchQuestionsByExamId(examId));

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          setIsTimeUp(true);
          handleSubmit();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [dispatch, examId, examDuration]);

  const handleAnswer = (
    questionId: string,
    selectedOption: string,
    isCorrect: boolean,
    marks: number
  ) => {
    setAnswers((prev) => [
      ...prev.filter((ans) => ans.questionId !== questionId),
      { questionId, selectedOption, isCorrect, marks },
    ]);
  };

  const handleSubmit = async () => {
    const result = await dispatch(
      submitAnswers({ userId, examId, answers })
    ).unwrap();

    const userAnswerDoc = doc(db, "userAnswers", result.userAnswerId);
    const docSnap = await getDoc(userAnswerDoc);

    if (docSnap.exists()) {
      const userAnswerData = docSnap.data();
      setScore(userAnswerData.score);
      setShowModal(true);
    } else {
      console.error("No such document!");
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    navigate("/");  
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  if (loading) return <div>Loading...</div>;

  const currentQuestion = questions[currentQuestionIndex];
  const answeredCount = answers.length;

  const selectedAnswer = answers.find(
    (ans) => ans.questionId === currentQuestion.id
  );

  return (
    <div>
      <Title level={2}>{examTitle}</Title>
      <Paragraph>
        Time Left: {Math.floor(timeLeft / 60)}:{timeLeft % 60}
      </Paragraph>
      <Progress
        percent={(answeredCount / questions.length) * 100}
        status="active"
      />
      <Paragraph>
        Question {currentQuestionIndex + 1} of {questions.length}
      </Paragraph>

      {currentQuestion && (
        <div key={currentQuestion.id}>
          <h2>{currentQuestion.questionText}</h2>
          <Radio.Group
            value={selectedAnswer?.selectedOption}
            onChange={(e) =>
              handleAnswer(
                currentQuestion.id,
                e.target.value,
                currentQuestion.options.find(
                  (opt: any) => opt.id === e.target.value
                )?.isCorrect,
                currentQuestion.marks
              )
            }
          >
            <Space direction="vertical">
              {currentQuestion.options.map((opt: any) => (
                <Radio key={opt.id} value={opt.id}>
                  {opt.text}
                </Radio>
              ))}
            </Space>
          </Radio.Group>
        </div>
      )}

      <div style={{ marginTop: 20 }}>
        <Button
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          style={{ marginRight: 10 }}
        >
          Previous
        </Button>
        <Button
          onClick={handleNext}
          disabled={currentQuestionIndex === questions.length - 1}
          style={{ marginRight: 10 }}
        >
          Next
        </Button>
        <Button type="primary" onClick={handleSubmit} disabled={isTimeUp}>
          {isTimeUp ? "Time's up!" : "Submit"}
        </Button>
      </div>

      <Modal
        title="Exam Completed"
        visible={showModal}
        onOk={handleCloseModal}
        onCancel={handleCloseModal}
        footer={[
          <Button key="close" onClick={handleCloseModal}>
            Close
          </Button>,
          <Button type="primary" onClick={() => navigate("/")}>
            Go to Home
          </Button>,
        ]}
      >
        <Paragraph>Your Score: {score}</Paragraph>
      </Modal>
    </div>
  );
};

export default ExamDetails;
