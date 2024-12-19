import React, { useEffect, useState } from "react";
import { Table, Tag, Button, Modal, message, Row, Col } from "antd";
import { ColumnsType } from "antd/es/table";
import { useDispatch, useSelector } from "react-redux";
import { fetchJobs, deleteJob } from "@/redux/slices/fetchJobsSlice";
import { toggleJobStatus } from "@/redux/slices/toggleJobStatus";
import { RootState, AppDispatch } from "@/redux/store";
import { LuDownload } from "react-icons/lu";
import "./jobTable.css";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";

interface Job {
  id: string;
  jobName: string;
  jobField: string;
  workLocations: string[];
  jobDescriptionFile: string;
  status: string;
}

const JobTable: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { jobs, loading, error } = useSelector(
    (state: RootState) => state.fetchJobs
  );

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentJobId, setCurrentJobId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchJobs());
  }, [dispatch]);

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
    jobField: job.jobField,
    workLocations: job.workLocations,
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
          <Button danger onClick={() => showDeleteModal(record.id)}>
            <MdDeleteForever />
          </Button>
          <Button
            style={{ marginLeft: 10 }}
            onClick={() => handleToggleStatus(record.id, record.status)}
          >
            {record.status === "active" ? <FaRegEyeSlash /> : <FaRegEye />}
          </Button>
        </>
      ),
    },
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
      

      {/* Modal xác nhận xóa */}
      <Modal
        title={
          <div style={{ color: "red", textAlign: "center" , fontWeight: "bold"}}>
            Xoá bài tuyển dụng?
          </div>
        }
        visible={isModalVisible}
        footer={null} 
        centered
      >
        <p style={{ textAlign: "center",margin:'10px 0'}}>
          Tất cả dữ liệu về ứng viên ứng tuyển cho vị trí này đều sẽ bị xóa và
          sẽ không thể khôi phục được Bạn chắc chắn muốn xóa bài tuyển dụng này?
        </p>
        <Row style={{display:'flex', justifyContent:'center', alignItems:'center'}}>
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
    </>
  );
};

export default JobTable;
