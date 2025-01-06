import React, { useState } from "react";
import { MenuOutlined } from "@ant-design/icons";
import { Menu, Drawer } from "antd";
import { useLocation, NavLink, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { signOut } from "firebase/auth";
import { logout } from "@/redux/slices/authSlice";
import { auth } from "@/firebaseConfig";
import logo from "../../assets/image/logo.png";
import { MdOutlinePersonSearch } from "react-icons/md";
import "./header.css";
import { IoIosLogOut } from "react-icons/io";
import { FaRegUser } from "react-icons/fa6";
import { FaBook } from "react-icons/fa";

const Navbar: React.FC = () => {
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();

  const user = useSelector((state: RootState) => state.auth);

  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
    const userRole = useSelector((state: RootState) => state.auth.role);


  const toggleDrawer = () => {
    setIsDrawerVisible(!isDrawerVisible);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      dispatch(logout());
      alert("Đăng xuất thành công!");
    } catch (err) {
      console.error("Lỗi đăng xuất:", err);
    }
  };

  const menuItems = [
    {
      key: "/business-dashboard",
      label: "Yêu cầu tuyển dụng",
      icon: (
        <MdOutlinePersonSearch
          style={{ fontSize: "25px", position: "relative", top: "5px" }}
        />
      ),
    },
  ];
  const menuItemsStudent = [
    {
      key: "/student-test",
      label: "Thi trắc nghiệm",
      icon: (
        <MdOutlinePersonSearch
          style={{ fontSize: "25px", position: "relative", top: "5px" }}
        />
      ),
    },
    {
      key: "/learning-process",
      label: "Tiến trình học tập",
      icon: (
        <FaBook
          style={{ fontSize: "25px", position: "relative", top: "5px" }}
        />
      ),
    },
  ];

  const renderMenu = () => (
    <>
      {userRole === "business" ? (
        <>
          {isAuthenticated && user ? (
            <>
              <div style={{ justifyContent: "center", flex: 1 }}>
                {menuItems.map((item) => (
                  <span style={{ margin: "0 10px" }} key={item.key}>
                    <NavLink
                      to={item.key}
                      style={({ isActive }) => ({
                        color: isActive ? "rgb(255, 90, 0)" : "black",
                        fontWeight: isActive ? "bold" : "bold",
                      })}
                    >
                      {item.icon} {item.label}
                    </NavLink>
                  </span>
                ))}
              </div>
            </>
          ) : null}
        </>
      ) : userRole === "student" ? (
        <>
          {isAuthenticated && user ? (
            <>
              <div style={{ justifyContent: "center", flex: 1 }}>
                {menuItemsStudent.map((item) => (
                  <span style={{ margin: "0 10px" }} key={item.key}>
                    <NavLink
                      to={item.key}
                      style={({ isActive }) => ({
                        color: isActive ? "rgb(255, 90, 0)" : "black",
                        fontWeight: isActive ? "bold" : "bold",
                      })}
                    >
                      {item.icon} {item.label}
                    </NavLink>
                  </span>
                ))}
              </div>
            </>
          ) : null}
        </>
      ) : userRole === "admin" ? (
        <></>
      ) : (
        <>
          <p className="title-head">
            HỆ THỐNG TUYỂN DỤNG
            <span className="title-head-2"> VÀ QUẢN LÝ SINH VIÊN THỰC TẬP</span>
          </p>
        </>
      )}
    </>
  );

  const renderUserSection = () => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        position: "relative",
        top: "5px",
        
      }}
    >
      {isAuthenticated && user ? (
        <>
          <div
            style={{
              display: "flex",
            }}
          >
            {" "}
            <p
              style={{
                borderRadius: "10px",
                background: "rgb(255, 90, 0) ",
                padding: "5px 10px",
                color: "white",
              }}
            >
              <span>
                {" "}<FaRegUser style={{ fontSize: "15px" }}/>
              </span>
              &nbsp; <strong>{user.name}</strong>!
            </p>
          </div>

          <p
            onClick={handleLogout}
            style={{
              color: "rgb(255, 90, 0)",
              border: "none",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            <IoIosLogOut style={{ fontSize: "25px" }} />
          </p>
        </>
      ) : null}
    </div>
  );

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 1000,
        background: "#ffffff",
      }}
    >
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <img src={logo} alt="logo" className="navbar-logo-image" />
        </Link>
        <div className="navbar-menu-desktop">
          {renderMenu()}
          {renderUserSection()}
        </div>
        <div className="navbar-menu-mobile">
          <MenuOutlined onClick={toggleDrawer} style={{ fontSize: "1.5rem" }} />
        </div>
        <Drawer
          title={
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span>Menu</span>
            </div>
          }
          placement="right"
          closable={true}
          onClose={toggleDrawer}
          open={isDrawerVisible}
        >
          {userRole === "business" ? (
            <>
              {isAuthenticated && user ? (
                <>
                  <Menu
                    mode="vertical"
                    selectedKeys={[location.pathname]}
                    theme="light"
                  >
                    {menuItems.map((item) => (
                      <Menu.Item key={item.key}>
                        <NavLink
                          to={item.key}
                          style={({ isActive }) => ({
                            color: isActive ? "rgb(255, 90, 0)" : "black",
                            fontWeight: isActive ? "bold" : "bold",
                          })}
                          onClick={toggleDrawer}
                        >
                          {item.label}
                        </NavLink>
                      </Menu.Item>
                    ))}
                  </Menu>
                </>
              ) : null}
            </>
          ) : userRole === "student" ? (
            <>
              {" "}
              <Menu
                mode="vertical"
                selectedKeys={[location.pathname]}
                theme="light"
              >
                {menuItemsStudent.map((item) => (
                  <Menu.Item key={item.key}>
                    <NavLink
                      to={item.key}
                      style={({ isActive }) => ({
                        color: isActive ? "rgb(255, 90, 0)" : "black",
                        fontWeight: isActive ? "bold" : "bold",
                      })}
                      onClick={toggleDrawer}
                    >
                      {item.label}
                    </NavLink>
                  </Menu.Item>
                ))}
              </Menu>
            </>
          ) : (
            <></>
          )}
          <div style={{ marginTop: "20px", textAlign: "center" }}>
            {isAuthenticated && user ? (
              <>
                <p>
                  Chào mừng, <strong>{user.email}</strong>!
                </p>
                <button
                  onClick={handleLogout}
                  style={{
                    padding: "5px 15px",
                    backgroundColor: "rgb(255, 90, 0)",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  Đăng Xuất
                </button>
              </>
            ) : null}
          </div>
        </Drawer>
      </div>
    </nav>
  );
};

export default Navbar;
