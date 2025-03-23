import React, { Component } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import "./Dashboard.css";

class Dashboard extends Component {
  render() {
    const { vehicle } = this.props;

    if (!vehicle) {
      return (
        <div className="error">
          No vehicle data. Please return to management.
        </div>
      );
    }

    return (
      <div className="dashboard-container">
        <div className="dashboard-header">
          Vehicle Dashboard - ID: <span>{vehicle.id}</span>
        </div>
        <div className="dashboard-body">
          <div className="sidebar">
            <NavLink
              to="/dashboard/schedule"
              state={{ vehicle }}
              className="tab-link"
            >
              List Schedule
            </NavLink>
            <NavLink
              to="/dashboard/energy"
              state={{ vehicle }}
              className="tab-link"
            >
              Energy/Fuel Consumption
            </NavLink>
            <NavLink
              to="/dashboard/maintenance"
              state={{ vehicle }}
              className="tab-link"
            >
              Maintenance
            </NavLink>
            <NavLink
              to="/dashboard/analytics"
              state={{ vehicle }}
              className="tab-link"
            >
              Analytics
            </NavLink>
          </div>
          <div className="tab-content">
            <Outlet context={{ vehicle }} /> {/* 红色框区域更新 */}
          </div>
        </div>
      </div>
    );
  }
}

// 包装类组件，获取 location.state.vehicle
function DashboardWrapper(props) {
  const location = useLocation();
  const navigate = useNavigate();
  const vehicle = location.state?.vehicle;

  React.useEffect(() => {
    if (!vehicle) {
      navigate("/management");
    } else {
      // 判断是否正好在 "/dashboard" 根路径
      if (location.pathname === "/dashboard") {
        // 自动跳转到 "/dashboard/schedule"，并传递 state.vehicle
        navigate("/dashboard/schedule", { state: { vehicle } });
      }
    }
  }, [vehicle, navigate, location.pathname]);

  if (!vehicle || location.pathname === "/dashboard") {
    return null; // 跳转期间不渲染内容
  }

  return <Dashboard {...props} vehicle={vehicle} />;
}

export default DashboardWrapper;
