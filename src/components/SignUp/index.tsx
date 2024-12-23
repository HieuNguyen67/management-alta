import React, { useState } from "react";
import { auth, db } from "@/firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { Form, Input, Select, Button, message } from "antd";

const { Option } = Select;

const RegisterForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (values: {
    name: string;
    email: string;
    password: string;
    role: string;
  }) => {
    setLoading(true);

    try {
      const { name, email, password, role } = values;

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const uid = userCredential.user.uid;

      await setDoc(doc(db, "users", uid), {
        name,
        email,
        role,
      });

      message.success("Đăng ký thành công! Vui lòng đăng nhập.");
      navigate("/");
    } catch (error) {
      console.error("Lỗi khi đăng ký:", error);
      message.error("Đăng ký thất bại. Vui lòng kiểm tra lại thông tin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      name="register"
      layout="vertical"
      onFinish={handleRegister}
      style={{ maxWidth: 400, margin: "0 auto" }}
    >
      <h3>Đăng ký tài khoản</h3>

      <Form.Item
        label="Họ và Tên"
        name="name"
        rules={[{ required: true, message: "Vui lòng nhập họ và tên!" }]}
      >
        <Input placeholder="Nhập họ và tên của bạn" />
      </Form.Item>

      <Form.Item
        label="Role"
        name="role"
        initialValue="student"
        rules={[{ required: true, message: "Vui lòng chọn role!" }]}
      >
        <Select>
          <Option value="student">Sinh viên</Option>
          <Option value="business">Doanh nghiệp</Option>
        </Select>
      </Form.Item>

      <Form.Item
        label="Email"
        name="email"
        rules={[
          { required: true, message: "Vui lòng nhập email!" },
          { type: "email", message: "Email không hợp lệ!" },
        ]}
      >
        <Input type="email" placeholder="Nhập email của bạn" />
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[
          { required: true, message: "Vui lòng nhập mật khẩu!" },
          { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự!" },
        ]}
      >
        <Input.Password placeholder="Nhập mật khẩu" />
      </Form.Item>

      <Form.Item>
        <Button
          htmlType="submit"
          block
          loading={loading}
          style={{
            width: "100%",
            background: "rgb(255, 90, 0)",
            color: "white",
            fontWeight: "bold",
          }}
        >
          {loading ? "Đang xử lý..." : "Đăng ký"}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default RegisterForm;
