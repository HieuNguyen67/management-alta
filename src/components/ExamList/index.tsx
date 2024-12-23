import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hook/hook";
import { fetchExams } from "@/redux/slices/examsSlice";
import { Select, Button, Spin, Typography, Row, Col } from "antd";
import { IoMdAdd } from "react-icons/io";

const { Title } = Typography;

const ExamList = ({
  onSelectExam,
}: {
  onSelectExam: (
    examId: string,
    examTitle: string,
    examDuration: number,
    examQuestions: any[]
  ) => void;
}) => {
  const dispatch = useAppDispatch();
  const { exams, loading } = useAppSelector((state) => state.exams);
  const [selectedExam, setSelectedExam] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchExams());
  }, [dispatch]);

  const handleSubmit = () => {
    const selected = exams.find((exam) => exam.id === selectedExam);
    if (selected) {
      onSelectExam(
        selected.id,
        selected.title,
        selected.duration,
        selected.questions
      );
    }
  };

  if (loading)
    return (
      <div>
        <Spin size="large" />
      </div>
    );

  return (
    <div>
      <Row justify={"center"}>
        <Col lg={10} xs={24}>
          {" "}
          <Select
            style={{ width: "80%" }}
            placeholder="Chọn môn thi"
            value={selectedExam}
            onChange={setSelectedExam}
          >
            {exams.map((exam) => (
              <Select.Option key={exam.id} value={exam.id}>
                {exam.title}
              </Select.Option>
            ))}
          </Select>
          <Button
            style={{ background: "rgb(255, 90, 0)", color: "white", marginTop: "10px" }}
            onClick={handleSubmit}
            disabled={!selectedExam}
          >
            <IoMdAdd style={{}} /> Tạo đề thi
          </Button>
        </Col>
       
      </Row>
    </div>
  );
};

export default ExamList;
