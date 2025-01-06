import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hook/hook";
import { fetchQuestionsByExamId } from "@/redux/slices/questionsSlice";
import { submitAnswers } from "@/redux/slices/userAnswersSlice";
import { db } from "@/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import {
  Button,
  Modal,
  Radio,
  Progress,
  Typography,
  Space,
  Row,
  Col,
  Input,
} from "antd";
import { useNavigate } from "react-router-dom";
import { FaRegClock } from "react-icons/fa";
import { MAIN_COLOR } from "@/constants/color";
import { GrLinkPrevious } from "react-icons/gr";
import { GrLinkNext } from "react-icons/gr";

const { Title, Paragraph } = Typography;
const { TextArea } = Input;

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
        if (prevTime <= 1) {  handleSubmit();
          clearInterval(timer);
          setIsTimeUp(true);
        
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [dispatch, examId, examDuration]);

  const handleAnswer = (questionId: string, selectedOption: string) => {
    const question = questions.find((q: any) => q.id === questionId);
    if (!question) {
      console.error("Question not found!");
      return;
    }

    let isCorrect = false;

    if (question.type === "multiple-choice") {
      const selectedOptionObj = question.options.find(
        (option: any) => option.id === selectedOption
      );
      if (!selectedOptionObj) {
        console.error("Selected option not found!");
        return;
      }
      isCorrect = selectedOptionObj.isCorrect;
    } else if (question.type === "fill-in-the-blank") {
      isCorrect =
        selectedOption.trim().toLowerCase() ===
        question.correctAnswer.trim().toLowerCase();
    }

    setAnswers((prev) => [
      ...prev.filter((ans) => ans.questionId !== questionId),
      {
        questionId,
        selectedOption,
        isCorrect,
        marks: isCorrect ? question.marks : 0,
      },
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
    (ans) => ans.questionId === currentQuestion?.id
  );

  return (
    <div style={{ padding: "20px" }}>
      <h3>Đề thi môn</h3>
      <Title level={2} style={{ fontWeight: "bold" }}>
        {examTitle}
      </Title>
      <div
        style={{ background: "white", padding: "20px", borderRadius: "10px" }}
      >
        <Row>
          <Col lg={6}>
            <h3 style={{ margin: "10px", fontWeight: "bold" }}>
              Tổng câu hỏi:{" "}
              <span style={{ color: MAIN_COLOR }}>{questions.length}</span>
            </h3>
          </Col>
          <Col lg={6}>
            <h3 style={{ margin: "10px", fontWeight: "bold" }}>
              Hoàn thành:{" "}
              <span style={{ color: MAIN_COLOR }}>
                {answeredCount} / {questions.length}
              </span>
            </h3>
          </Col>
          <Col lg={6}>
            <h3
              style={{ margin: "10px", color: MAIN_COLOR, fontWeight: "bold" }}
            >
              <FaRegClock
                style={{ fontSize: "15px", position: "relative", top: "3px" }}
              />
              &nbsp;{Math.floor(timeLeft / 60)}:{timeLeft % 60}
            </h3>
          </Col>
          <Col lg={6}>
            <Button
              onClick={handleSubmit}
              disabled={isTimeUp}
              style={{
                padding: "20px",
                background: MAIN_COLOR,
                color: "white",
              }}
            >
              {isTimeUp ? "Hết thời gian!" : "Nộp bài"}
            </Button>
          </Col>
        </Row>
      </div>

      <h2 style={{ marginTop: 20, fontWeight: "bold" }}>
        Câu {currentQuestionIndex + 1}
      </h2>

      {currentQuestion && (
        <div
          key={currentQuestion.id}
          style={{ marginTop: 20, borderRadius: "10px", padding: "20px" }}
        >
          <h2>{currentQuestion.questionText}</h2>
          {currentQuestion.type === "fill-in-the-blank" ? (
            <TextArea
              rows={4}
              placeholder="Nhập câu trả lời của bạn"
              value={selectedAnswer?.selectedOption || ""}
              onChange={(e) => handleAnswer(currentQuestion.id, e.target.value)}
            />
          ) : (
            <Radio.Group
              value={selectedAnswer?.selectedOption}
              onChange={(e) => handleAnswer(currentQuestion.id, e.target.value)}
            >
              <Space direction="vertical">
                {currentQuestion?.options?.map((opt: any) => (
                  <Radio
                    key={opt.id}
                    value={opt.id}
                    style={{
                      background: "white",
                      padding: "10px",
                      borderRadius: "10px",
                    }}
                  >
                    {opt.id}. {opt.text}
                  </Radio>
                ))}
              </Space>
            </Radio.Group>
          )}
        </div>
      )}

      <div style={{ marginTop: 20, display: "flex", justifyContent: "end" }}>
        <Button
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          style={{ marginRight: 10, background: MAIN_COLOR, color: "white" }}
        >
          <GrLinkPrevious />
        </Button>
        <Button
          onClick={handleNext}
          disabled={currentQuestionIndex === questions.length - 1}
          style={{ background: MAIN_COLOR, color: "white" }}
        >
          <GrLinkNext />
        </Button>
      </div>

      <Modal
        title="Bạn đã nộp bài thi"
        visible={showModal}
        onOk={handleCloseModal}
        onCancel={handleCloseModal}
        footer={[
          <Button key="close" onClick={handleCloseModal}>
            Đóng
          </Button>,
        ]}
      >
        <Paragraph>
          Bạn đạt được số điểm:{" "}
          <span style={{ color: "rgba(242, 109, 33, 1)", fontWeight: "bold" }}>
            {score} điểm
          </span>
        </Paragraph>
        <div style={{ marginTop: 20 }}>
          <Title level={4}>Chi tiết câu trả lời:</Title>
          {answers.map((answer) => {
            const question = questions.find((q) => q.id === answer.questionId);
            return (
              <div
                key={answer.questionId}
                style={{
                  marginBottom: "10px",
                  padding: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "10px",
                }}
              >
                <Paragraph>
                  <strong>Câu hỏi:</strong> {question?.questionText}
                </Paragraph>
                <Paragraph>
                  <strong>Loại câu hỏi:</strong>{" "}
                  {question?.type === "multiple-choice"
                    ? "Trắc nghiệm"
                    : "Điền đáp án"}
                </Paragraph>
                <Paragraph>
                  <strong>Câu trả lời của bạn:</strong>{" "}
                  {question?.type === "multiple-choice"
                    ? `Lựa chọn: ${answer.selectedOption}`
                    : `Đáp án: ${answer.selectedOption}`}
                </Paragraph>
                <Paragraph>
                  <strong>Kết quả:</strong>{" "}
                  {answer.isCorrect ? (
                    <span style={{ color: "green" }}>Đúng</span>
                  ) : (
                    <span style={{ color: "red" }}>Sai</span>
                  )}
                </Paragraph>
                <Paragraph>
                  <strong>Điểm:</strong> {answer.marks}
                </Paragraph>
              </div>
            );
          })}
        </div>
      </Modal>
    </div>
  );
};

export default ExamDetails;
