import { Col, Row } from "antd";
import Navbar from "../Header";
import Footer from "../Footer";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <>
      <Row>
        <Col span={24}>
          <Navbar />
        </Col>
      </Row>
      <Row>
        <Col span={24} style={{ background: "#f0f2f5" }} className="container">
          {children}
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Footer />
        </Col>
      </Row>
    </>
  );
};
export default MainLayout
