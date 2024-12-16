import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchJobs } from "../../redux/slices/jobSlice";
import { RootState, AppDispatch } from "../../redux/store";
import "./jobList.css";
import { Button, Col, Row, Pagination, Select, Input, Empty } from "antd";
import { FaDownload } from "react-icons/fa";
import { CiMail } from "react-icons/ci";
import { FaPhone } from "react-icons/fa6";
import notfound from "@/assets/image/not-found.png"
import { CiSearch } from "react-icons/ci";


const { Option } = Select;


const JobList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { jobs, loading, error } = useSelector(
    (state: RootState) => state.jobs
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedJobField, setSelectedJobField] = useState<string | null>(null);
  const [selectedCompanyName, setSelectedCompanyName] = useState<string | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");

  const itemsPerPage = 6;

  useEffect(() => {
    dispatch(fetchJobs());
  }, [dispatch]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  const sortedJobs = [...jobs].sort((a, b) => a.jobId.localeCompare(b.jobId));

  const filteredJobs = sortedJobs.filter((job) => {
    const matchesField = !selectedJobField || job.jobField === selectedJobField;
    const matchesCompany =
      !selectedCompanyName || job.companyName === selectedCompanyName;
    const matchesSearch = job.jobName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesField && matchesCompany && matchesSearch;
  });

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentJobs = filteredJobs.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleJobFieldChange = (value: string | null) => {
    setSelectedJobField(value);
    setCurrentPage(1); 
  };

  const handleCompanyNameChange = (value: string | null) => {
    setSelectedCompanyName(value);
    setCurrentPage(1); 
  };

  const handleSearch = () => {
    setCurrentPage(1); 
  };

  const uniqueJobFields = Array.from(new Set(jobs.map((job) => job.jobField)));
  const uniqueCompanyNames = Array.from(
    new Set(jobs.map((job) => job.companyName))
  );

  return (
    <div>
      <Row style={{ padding: "20px 10px" }}>
        {" "}
        <Col xs={24} lg={7} style={{ marginTop: "10px" }}>
          <div
            style={{
              border: "1px solid #d9d9d9",
              borderRadius: "7px",
              background: "white",
            }}
          >
            <Row>
              <Col span={3}>
                {" "}
                <CiSearch
                  style={{
                    color: "rgb(255, 90, 0)",
                    fontSize: "20px",
                    marginTop: "15px",
                    marginLeft: "10px",
                  }}
                />
              </Col>
              <Col span={21}>
                <Input
                  placeholder="Nhập vị trí muốn ứng tuyển"
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    width: "100%",
                    height: "50px",
                    border: "none",
                    padding: "10px",
                    color: "grey",
                  }}
                />
              </Col>
            </Row>
          </div>
        </Col>
        <Col xs={24} lg={7} style={{ marginTop: "10px" }}>
          <Select
            allowClear
            placeholder="Chọn Lĩnh Vực Chuyên Môn"
            onChange={handleJobFieldChange}
            style={{ width: "100%", height: "50px", color: "black" }}
          >
            {uniqueJobFields.map((field) => (
              <Option key={field} value={field}>
                {field}
              </Option>
            ))}
          </Select>
        </Col>
        <Col xs={24} lg={7} style={{ marginTop: "10px" }}>
          <Select
            allowClear
            placeholder="Chọn Công Ty"
            onChange={handleCompanyNameChange}
            style={{ width: "100%", height: "50px" }}
          >
            {uniqueCompanyNames.map((company) => (
              <Option key={company} value={company}>
                {company}
              </Option>
            ))}
          </Select>
        </Col>
        <Col xs={24} lg={3} style={{ marginTop: "10px" }}>
          <Button
            style={{
              width: "100%",
              height: "50px",
              background: "rgb(255, 90, 0)",
              color: "white",
            }}
          >
            <CiSearch style={{ color: "white", fontSize: "20px" }} />
            Tìm việc
          </Button>
        </Col>
      </Row>

      {currentJobs.length === 0 ? (
        <>
          <div
            style={{
              display: "grid",
              justifyItems: "center",
              justifyContent: "center",
              marginTop: "50px",
            }}
          >
            <img
              src={notfound}
              alt="not-found"
              className="w-100"
              loading="lazy"
            />
          </div>

          <Empty
            description="Không tìm thấy công việc nào phù hợp"
            style={{ marginTop: "50px" }}
          />
        </>
      ) : (
        <Row>
          {currentJobs.map((job) => (
            <Col lg={8} xs={24} key={job.jobId}>
              <div className="job-card" style={{ margin: "16px" }}>
                <Row>
                  <Col span={4}>
                    <img
                      src={job.companyImage}
                      alt={job.companyName}
                      className="job-image"
                    />
                  </Col>
                  <Col span={16} style={{ paddingLeft: "10px" }}>
                    <h3>{job.jobName}</h3>
                    <p style={{ color: "grey" }}>{job.companyName}</p>
                  </Col>
                  <Col span={4}>
                    <a
                      href={job.jobDescriptionFile}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button
                        style={{
                          background: "rgb(255, 90, 0)",
                          color: "white",
                        }}
                      >
                        <FaDownload />
                      </Button>
                    </a>
                  </Col>
                </Row>

                <p style={{ display: "none" }}>{job.jobField}</p>
                <p style={{ height: "20px" }}>{job.description}</p>
                <hr style={{ marginTop: "20px", marginBottom: "10px" }} />
                <Row>
                  <Col span={12} style={{ borderRight: "2px solid #ddd" }}>
                    <p
                      style={{
                        color: "grey",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "10px",
                      }}
                    >
                      <CiMail style={{ fontSize: "20px" }} />
                      &nbsp;tuyendung@alta.com.vn
                    </p>
                  </Col>
                  <Col span={12}>
                    <p
                      style={{
                        color: "grey",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "12px",
                      }}
                    >
                      <FaPhone style={{ fontSize: "20px" }} />
                      &nbsp;0282 240 9960
                    </p>
                  </Col>
                </Row>
              </div>
            </Col>
          ))}
        </Row>
      )}

      {currentJobs.length > 0 && (
        <div style={{ display: "grid", justifyContent: "center" }}>
          <Pagination
            current={currentPage}
            total={filteredJobs.length}
            pageSize={itemsPerPage}
            onChange={handlePageChange}
            style={{ textAlign: "center", marginTop: "20px" }}
          />
        </div>
      )}
    </div>
  );
};

export default JobList;
