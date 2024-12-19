import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import JobTable from "@/components/JobTable";
import { Button } from "antd";
import AddJobModal from "@/components/AddJobModal";
import { IoAdd } from "react-icons/io5";

const BusinessDashboard: React.FC = () => {

  const [isModalOpen, setIsModalOpen] = useState(false);


  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const navigate = useNavigate(); 

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/"); 
    }
  }, [isAuthenticated, navigate]);



  return (
    <div>
      <div style={{ padding: "30px" }}>
        <Button
          style={{ background: "rgb(255, 90, 0)", color: "white" }}
          onClick={() => setIsModalOpen(true)}
        >
          Thêm vị trí tuyển dụng <IoAdd />
        </Button>
        <AddJobModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </div>
      <div style={{ margin: "0px 30px" }}>
        <JobTable />
      </div>
    </div>
  );
};

export default BusinessDashboard;
    