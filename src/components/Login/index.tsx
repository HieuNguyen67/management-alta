import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hook/hook";
import { loginSuccess } from "@/redux/slices/authSlice";
import { auth, db } from "@/firebaseConfig";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Select, message, Row, Col } from "antd";
import login from "@/assets/image/image 5.png";

const { Option } = Select;

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, role: userRole } = useAppSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isAuthenticated) {
      switch (userRole) {
        case "admin":
          navigate("/admin-dashboard");
          break;
        case "business":
          navigate("/business-dashboard");
          break;
        case "student":
          navigate("/student-dashboard");
          break;
        default:
          break;
      }
    }
  }, [isAuthenticated, userRole, navigate]);

  const handleSubmit = async (values: any) => {
    const { email, password, role } = values;
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const uid = userCredential.user.uid;
      const userDocRef = doc(db, "users", uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.role === role) {
          dispatch(
            loginSuccess({ email: userData.email, role: userData.role })
          );

          switch (role) {
            case "admin":
              navigate("/admin-dashboard");
              break;
            case "business":
              navigate("/business-dashboard");
              break;
            case "student":
              navigate("/student-dashboard");
              break;
            default:
              message.error("Role không xác định!");
              break;
          }
        } else {
          message.error("Role không khớp với tài khoản!");
        }
      } else {
        message.error("Tài khoản không tồn tại trong Firestore!");
      }
    } catch (error) {
      console.error("Đăng nhập thất bại:", error);
      message.error("Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.");
    }
  };

  const handleForgotPassword = async () => {
    try {
      if (resetEmail) {
        await sendPasswordResetEmail(auth, resetEmail);
        message.success("Một email để đặt lại mật khẩu đã được gửi đến bạn.");
        setIsForgotPassword(false);
      } else {
        message.error("Vui lòng nhập email.");
      }
    } catch (error) {
      console.error("Gửi email quên mật khẩu thất bại:", error);
      message.error("Có lỗi xảy ra, vui lòng thử lại sau.");
    }
  };

  return (
    <div>
      {isForgotPassword ? (
        <div style={{ margin: "90px 40px" }}>
          <Row>
            <Col lg={12} xs={24}>
              <h1 style={{ color: "rgb(255, 90, 0)", fontWeight: "bold" }}>
                Quên mật khẩu
              </h1>
              <p>
                Vui lòng nhập địa chỉ email đã đăng kí để yêu cầu khôi phục lại
                mật khẩu
              </p>
              <Form layout="vertical">
                <Form.Item
                  label="Email"
                  rules={[{ required: true, message: "Vui lòng nhập email!" }]}
                >
                  <Input
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                  />
                </Form.Item>
                <Button
                  onClick={handleForgotPassword}
                  style={{
                    width: "100%",
                    background: "rgb(255, 90, 0)",
                    color: "white",
                    fontWeight: "bold",
                  }}
                >
                  Xác nhận
                </Button>
                <div
                  style={{
                    display: "grid",
                    justifyItems: "end",
                    marginTop: "10px",
                  }}
                >
                  <Button
                    onClick={() => setIsForgotPassword(false)}
                    style={{
                      color: "rgb(255, 90, 0)",
                      textDecoration: "underline",
                    }}
                    type="link"
                  >
                    Quay lại đăng nhập
                  </Button>
                </div>
              </Form>
            </Col>
            <Col lg={12} xs={24}>
              <div style={{ margin: "10px 40px" }}>
                <img
                  src={login}
                  alt="login"
                  loading="lazy"
                  className="img-login"
                />
              </div>
            </Col>
          </Row>
        </div>
      ) : (
        <div style={{ margin: "90px 40px" }}>
          <Row>
            <Col lg={12} xs={24}>
              <h2 style={{ fontWeight: "bold" }}>Đăng nhập</h2>
              <Form onFinish={handleSubmit} layout="vertical">
                <Form.Item
                  label="Vai trò"
                  name="role"
                  initialValue={role}
                  rules={[
                    { required: true, message: "Vui lòng chọn vai trò!" },
                  ]}
                >
                  <Select value={role} onChange={(value) => setRole(value)}>
                    <Option value="student">Sinh viên</Option>
                    <Option value="business">Doanh nghiệp</Option>
                    <Option value="admin">Quản trị viên</Option>
                  </Select>
                </Form.Item>
                <Form.Item
                  label="Email"
                  name="email"
                  rules={[{ required: true, message: "Vui lòng nhập email!" }]}
                >
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Form.Item>
                <Form.Item
                  label="Password"
                  name="password"
                  rules={[
                    { required: true, message: "Vui lòng nhập mật khẩu!" },
                  ]}
                >
                  <Input.Password
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Form.Item>
                <div
                  style={{
                    display: "grid",
                    justifyItems: "end",
                    margin: "10px 0px",
                  }}
                >
                  <Button
                    type="link"
                    onClick={() => setIsForgotPassword(true)}
                    style={{
                      marginLeft: "10px",
                      color: "rgb(255, 90, 0)",
                    }}
                  >
                    Quên mật khẩu?
                  </Button>
                </div>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{
                    width: "100%",
                    background: "rgb(255, 90, 0)",
                    fontWeight: "bold",
                  }}
                >
                  Đăng nhập
                </Button>
              </Form>
            </Col>
            <Col lg={12} xs={24}>
              <div style={{ margin: "10px 40px" }}>
                <img
                  src={login}
                  alt="login"
                  loading="lazy"
                  className="img-login"
                />
              </div>
            </Col>
          </Row>
        </div>
      )}
    </div>
  );
};

export default LoginForm;
