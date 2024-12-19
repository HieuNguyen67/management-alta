import React, { useState } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  Button,
  Upload,
  message,
  Row,
  Col,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { addJob } from "@/redux/slices/addJobSlice";
import axios from "axios";

const { Option } = Select;

interface AddJobModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddJobModal: React.FC<AddJobModalProps> = ({ isOpen, onClose }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { loading } = useSelector((state: any) => state.addJob);

  const [companyImageUrl, setCompanyImageUrl] = useState<string>("");
  const [jobDescriptionFileUrl, setJobDescriptionFileUrl] =
    useState<string>("");

  const handleFileUpload = async (file: File, type: "image" | "file") => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "Project-Alta");

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/da2alfbg9/upload",
        formData
      );
      if (response.data && response.data.secure_url) {
        return response.data.secure_url;
      } else {
        throw new Error("Upload succeeded but no URL returned.");
      }
    } catch (error) {
      message.error("File upload failed!");
      console.error("Error uploading file:", error);
      return null;
    }
  };

  const handleImageChange = async (info: any) => {
    if (info.file.status === "done") {
      const imageUrl = await handleFileUpload(info.file.originFileObj, "image");
      setCompanyImageUrl(imageUrl || "");
      message.success("Company image uploaded successfully!");
    }
  };

  const handleFileChange = async (info: any) => {
    if (info.file.status === "done") {
      const fileUrl = await handleFileUpload(info.file.originFileObj, "file");
      if (fileUrl) {
        setJobDescriptionFileUrl(fileUrl);
        message.success("Job description file uploaded successfully!");
      } else {
        message.error("Failed to upload job description file.");
      }
    }
  };

  const handleSubmit = async (values: any) => {
    if (!companyImageUrl || !jobDescriptionFileUrl) {
      message.error("Please upload all required files!");
      return;
    }

    const jobData = {
      ...values,
      companyImage: companyImageUrl,
      jobDescriptionFile: jobDescriptionFileUrl,
      status: "active", 
    };

    dispatch(addJob(jobData) as any).then(() => {
      form.resetFields();
      setCompanyImageUrl("");
      setJobDescriptionFileUrl("");
      onClose();
    });
  };

  const provinces = [
    "Hà Nội",
    "Hồ Chí Minh",
    "An Giang",
    "Bà Rịa - Vũng Tàu",
    "Bạc Liêu",
    "Bắc Giang",
    "Bắc Kạn",
    "Bắc Ninh",
    "Bến Tre",
    "Bình Dương",
    "Bình Định",
    "Bình Phước",
    "Bình Thuận",
    "Cà Mau",
    "Cao Bằng",
    "Cần Thơ",
    "Đà Nẵng",
    "Đắk Lắk",
    "Đắk Nông",
    "Điện Biên",
    "Đồng Nai",
    "Đồng Tháp",
    "Gia Lai",
    "Hà Giang",
    "Hà Nam",
    "Hà Tĩnh",
    "Hải Dương",
    "Hải Phòng",
    "Hậu Giang",
    "Hòa Bình",
    "Hưng Yên",
    "Khánh Hòa",
    "Kiên Giang",
    "Kon Tum",
    "Lai Châu",
    "Lâm Đồng",
    "Lạng Sơn",
    "Lào Cai",
    "Long An",
    "Nam Định",
    "Nghệ An",
    "Ninh Bình",
    "Ninh Thuận",
    "Phú Thọ",
    "Phú Yên",
    "Quảng Bình",
    "Quảng Nam",
    "Quảng Ngãi",
    "Quảng Ninh",
    "Quảng Trị",
    "Sóc Trăng",
    "Sơn La",
    "Tây Ninh",
    "Thái Bình",
    "Thái Nguyên",
    "Thanh Hóa",
    "Thừa Thiên Huế",
    "Tiền Giang",
    "Trà Vinh",
    "Tuyên Quang",
    "Vĩnh Long",
    "Vĩnh Phúc",
    "Yên Bái",
  ];

  


  return (
    <Modal
      title={
        <div
          style={{
            color: "rgba(242, 109, 33, 1)",
            fontWeight: "bold",
          }}
        >
          Thêm vị trí tuyển dụng
        </div>
      }
      open={isOpen}
      onCancel={onClose}
      footer={null}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label="Tên công việc"
          name="jobName"
          rules={[{ required: true, message: "Vui lòng nhập tên công việc!" }]}
        >
          <Input placeholder="Vui lòng nhập tên công việc" />
        </Form.Item>
        <Form.Item
          label="Tên công ty"
          name="companyName"
          rules={[{ required: true, message: "Vui lòng nhập Tên công ty!" }]}
        >
          <Input placeholder="Vui lòng nhập Tên công ty" />
        </Form.Item>
        <Form.Item
          label="Tên lĩnh vực"
          name="jobField"
          rules={[{ required: true, message: "Vui lòng nhập Tên lĩnh vực!" }]}
        >
          <Input placeholder="Vui lòng nhập Tên lĩnh vực" />
        </Form.Item>
        <Form.Item
          label="Nơi làm việc"
          name="workLocations"
          rules={[{ required: true, message: "Vui lòng nhập Nơi làm việc!" }]}
        >
          <Select mode="multiple" placeholder="Vui lòng nhập Nơi làm việc">
            {provinces.map((province) => (
              <Option key={province} value={province}>
                {province}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="Mô tả vị trí tuyển dụng"
          name="description"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập Mô tả vị trí tuyển dụng!",
            },
          ]}
        >
          <Input.TextArea
            rows={4}
            placeholder="Vui lòng nhập Mô tả vị trí tuyển dụng"
          />
        </Form.Item>
        <Form.Item
          label="Ảnh công ty"
          rules={[{ required: true, message: "Vui lòng nhập Ảnh công ty!" }]}
        >
          <Upload
            listType="picture-card"
            customRequest={({ file, onSuccess }) => {
              setTimeout(() => onSuccess?.("ok"), 0);
            }}
            onChange={handleImageChange}
          >
            {companyImageUrl ? null : (
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            )}
          </Upload>
        </Form.Item>
        <Form.Item
          label="Tải file job description"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập Tải file job description!",
            },
          ]}
        >
          <Upload
            customRequest={({ file, onSuccess }) => {
              setTimeout(() => onSuccess?.("ok"), 0);
            }}
            onChange={handleFileChange}
          >
            <Button icon={<PlusOutlined />}>Upload File</Button>
          </Upload>
        </Form.Item>
        <Form.Item>
          <Row>
            <Col xs={24} lg={12}>
              <div style={{ marginRight: "10px" }}>
                <Button
                  style={{
                    background: "rgba(240, 240, 240, 1)",
                    color: "black",
                  }}
                  onClick={onClose}
                  block
                >
                  Đóng
                </Button>
              </div>
            </Col>
            <Col xs={24} lg={12}>
              <div style={{ marginLeft: "10px" }}>
                <Button
                  style={{ background: "rgb(255, 90, 0)", color: "white" }}
                  htmlType="submit"
                  loading={loading}
                  block
                >
                  Xác nhận
                </Button>
              </div>
            </Col>
          </Row>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddJobModal;
