import React, { useState } from "react";
import { db } from "../../firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import {
  Input,
  Button,
  Form,
  notification,
  Col,
  Row,
  Modal,
  Select,
} from "antd";
import { RiSendPlaneFill } from "react-icons/ri";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import "./learningProcess.css"
const FormLearningProcess: React.FC = () => {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [docId, setDocId] = useState("");
  const user = useSelector((state: RootState) => state.auth);

  const handleSubmit = async (values: {
    group: string;
    linkFile: string;
    content: string;
  }) => {
    try {
      const docRef = await addDoc(collection(db, "learning-process"), {
        group: values.group,
        linkFile: values.linkFile,
        content: values.content,
        createdAt: new Date(),
        userId: user.id,
      });

      setDocId(docRef.id);
      setIsModalVisible(true);
      form.resetFields();
    } catch (error) {
      notification.error({
        message: "Error",
        description: "Failed to add company.",
      });
    }
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  return (
    <div>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          group: "",
          linkFile: "",
          content: "",
        }}
      >
        <Row>
          <Col lg={24} xs={24}>
            <Form.Item
              label="Chọn lớp / Chọn nhóm thực tập"
              name="group"
              rules={[
                {
                  required: true,
                  message: "Vui lòng Chọn lớp / Chọn nhóm thực tập",
                },
              ]}
              className="input"
            >
              <Select placeholder="Chọn lớp / Chọn nhóm thực tập">
                <Select.Option value="Internship_Frontend_11/2024">
                  Internship_Frontend_11/2024
                </Select.Option>
                <Select.Option value="Internship_Frontend_09/2024">
                  Internship_Frontend_09/2023
                </Select.Option>
                <Select.Option value="Internship_Frontend_06/2024">
                  Internship_Frontend_06/2023
                </Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col lg={24} xs={24}>
            <Form.Item
              label="Link file"
              name="linkFile"
              rules={[{ required: true, message: "Vui lòng nhập Link file" }]}
              className="input"
            >
              <Input placeholder="Nhập Link file" />
            </Form.Item>
          </Col>
          <Col lg={24} xs={24}>
            <Form.Item
              label="Nội dung báo cáo"
              name="content"
              rules={[
                { required: true, message: "Vui lòng nhập Nội dung báo cáo" },
              ]}
              className="input"
            >
              <Input.TextArea placeholder="Nhập Nội dung báo cáo" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item>
          <Button
            style={{
              backgroundColor: "rgb(255, 90, 0)",
              color: "white",
              fontSize: "15px",
              margin: "16px",
            }}
            htmlType="submit"
          >
            Gửi <RiSendPlaneFill />
          </Button>
        </Form.Item>
      </Form>

      <Modal
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleOk}
        okText="OK"
        cancelButtonProps={{ style: { display: "none" } }}
        okButtonProps={{ style: { display: "none" } }}
      >
        <h1
          style={{ color: "#F26D21", fontWeight: "bold", textAlign: "center" }}
        >
          Thông báo
        </h1>
        <p style={{ textAlign: "center" }}>Bạn đã nộp báo cáo thành công.</p>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Button
            onClick={handleOk}
            style={{ background: "#EDEDED", padding: "20px" }}
          >
            Đóng
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default FormLearningProcess;
