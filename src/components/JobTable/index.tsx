import React, { useEffect, useState } from "react";
import { Table, Tag, Button, Modal, message, Row, Col, Form, Input, Select } from "antd";
import { ColumnsType } from "antd/es/table";
import { useDispatch, useSelector } from "react-redux";
import { fetchJobs, deleteJob, updateJob } from "@/redux/slices/fetchJobsSlice";
import { toggleJobStatus } from "@/redux/slices/toggleJobStatus";
import { RootState, AppDispatch } from "@/redux/store";
import { LuDownload } from "react-icons/lu";
import "./jobTable.css";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { FiEdit } from "react-icons/fi";

  const { Option } = Select;

interface Job {
  id: string;
  jobName: string;
  companyName: string;
  companyImage: string;
  jobField: string;
  workLocations: string[];
  description: string;
  jobDescriptionFile: string;
  status: string;
}


const JobTable: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { jobs, loading, error } = useSelector(
    (state: RootState) => state.fetchJobs
  );

  const [isModalVisible, setIsModalVisible] = useState(false);
    const [isModalVisible1, setIsModalVisible1] = useState(false);

  const [currentJobId, setCurrentJobId] = useState<string | null>(null);
    const [currentJob, setCurrentJob] = useState<Job | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    dispatch(fetchJobs());
  }, [dispatch]);

  const showEditModal = (job: Job) => {
    setCurrentJob(job);
    form.setFieldsValue(job);
    setIsModalVisible1(true);
  };

  const handleCancel1 = () => {
    setIsModalVisible1(false);
    setCurrentJob(null);
    form.resetFields();
  };

  const handleUpdate = async () => {
    try {
      const updatedJob = { ...currentJob, ...form.getFieldsValue() };
      if (updatedJob) {
        await dispatch(updateJob(updatedJob)).unwrap();
        message.success("Cập nhật công việc thành công!");
      }
    } catch (err) {
      message.error("Lỗi khi cập nhật công việc!");
    } finally {
      setIsModalVisible1(false);
    }
  };


  const showDeleteModal = (id: string) => {
    setCurrentJobId(id);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setCurrentJobId(null);
  };

  const confirmDelete = async () => {
    if (!currentJobId) return;
    try {
      await dispatch(deleteJob(currentJobId)).unwrap();
      message.success("Xóa công việc thành công!");
    } catch (err) {
      message.error("Lỗi khi xóa công việc!");
    } finally {
      setIsModalVisible(false);
      setCurrentJobId(null);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    try {
      await dispatch(toggleJobStatus({ id, currentStatus })).unwrap();
      message.success("Cập nhật trạng thái thành công!");
    } catch (err) {
      message.error("Lỗi khi cập nhật trạng thái!");
    }
  };

   const dataSource: Job[] = jobs.map((job) => ({
     id: job.id,
     jobName: job.jobName,
     companyName: job.companyName,
     companyImage: job.companyImage,
     jobField: job.jobField,
     workLocations: job.workLocations,
     description: job.description,
     jobDescriptionFile: job.jobDescriptionFile,
     status: job.status,
   }));

  if (error) return <p>Error: {error}</p>;

  const columns: ColumnsType<Job> = [
    {
      title: "Tên công việc",
      dataIndex: "jobName",
      key: "jobName",
    },
    {
      title: "Lĩnh vực tuyển dụng",
      dataIndex: "jobField",
      key: "jobField",
    },
    {
      title: "Nơi làm việc",
      dataIndex: "workLocations",
      key: "workLocations",
      render: (locations: string[]) => (
        <>
          {locations.map((location) => (
            <Tag color="blue" key={location}>
              {location}
            </Tag>
          ))}
        </>
      ),
    },
    {
      title: "Job Description",
      dataIndex: "jobDescriptionFile",
      key: "jobDescriptionFile",
      render: (link: string) => (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#1677ff" }}
        >
          <LuDownload style={{ fontSize: "20px", color: "rgb(255, 90, 0)" }} />
        </a>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={status === "active" ? "green" : "red"}>{status}</Tag>
      ),
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (_, record) => (
        <>
          <Button
            color="primary"
            variant="outlined"
            onClick={() => showEditModal(record)}
            style={{ marginLeft: 10 }}
          >
            <FiEdit />
          </Button>
          <Button
            variant="outlined"
            style={{ marginLeft: 10, color: "rgb(255, 90, 0)" }}
            onClick={() => handleToggleStatus(record.id, record.status)}
          >
            {record.status === "active" ? <FaRegEyeSlash /> : <FaRegEye />}
          </Button>
          <Button
            danger
            onClick={() => showDeleteModal(record.id)}
            style={{ marginLeft: 10, color: "rgb(255, 90, 0)" }}
          >
            <MdDeleteForever />
          </Button>
        </>
      ),
    },
  ];

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
    <>
      <Table
        dataSource={dataSource}
        columns={columns}
        loading={loading}
        rowKey="id"
        pagination={{
          pageSize: 5,
          style: { display: "flex", justifyContent: "center" },
        }}
        bordered
      />

      <Modal
        title={
          <div
            style={{ color: "red", textAlign: "center", fontWeight: "bold" }}
          >
            Xoá bài tuyển dụng?
          </div>
        }
        visible={isModalVisible}
        footer={null}
        centered
      >
        <p style={{ textAlign: "center", margin: "10px 0" }}>
          Tất cả dữ liệu về ứng viên ứng tuyển cho vị trí này đều sẽ bị xóa và
          sẽ không thể khôi phục được Bạn chắc chắn muốn xóa bài tuyển dụng này?
        </p>
        <Row
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Col xs={24} lg={6}>
            <div style={{ marginRight: "10px" }}>
              <Button
                style={{
                  background: "rgba(240, 240, 240, 1)",
                  color: "black",
                }}
                onClick={handleCancel}
                block
              >
                Đóng
              </Button>
            </div>
          </Col>
          <Col xs={24} lg={6}>
            <div style={{ marginLeft: "10px" }}>
              <Button
                style={{ background: "rgb(255, 90, 0)", color: "white" }}
                onClick={confirmDelete}
                loading={loading}
                block
              >
                Xác nhận
              </Button>
            </div>
          </Col>
        </Row>
      </Modal>
      <Modal
        title={
          <div
            style={{
              color: "rgba(242, 109, 33, 1)",
              fontWeight: "bold",
            }}
          >
            Chỉnh sửa thông tin tuyển dụng
          </div>
        }
        visible={isModalVisible1}
        onCancel={handleCancel1}
        onOk={handleUpdate}
        okText="Cập nhật"
        cancelText="Hủy"
        footer={null}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="jobName"
            label="Tên công việc"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="companyName"
            label="Tên công ty"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="workLocations"
            label="Nơi làm việc"
            rules={[{ required: true }]}
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
            name="description"
            label="Mô tả"
            rules={[{ required: true }]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
        <Row>
          <Col xs={24} lg={12}>
            <div style={{ marginRight: "10px" }}>
              <Button
                style={{
                  background: "rgba(240, 240, 240, 1)",
                  color: "black",
                }}
                onClick={handleCancel1}
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
                onClick={handleUpdate}
                loading={loading}
                block
              >
                Xác nhận
              </Button>
            </div>
          </Col>
        </Row>
      </Modal>
    </>
  );
};

export default JobTable;



