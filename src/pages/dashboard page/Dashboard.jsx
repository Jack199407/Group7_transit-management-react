import React, { Component, useEffect } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import "./Dashboard.css";

class Dashboard extends Component {
  handleBack = () => {
    this.props.navigate("/management");
  };

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
          <button className="back-button" onClick={this.handleBack}>
            ← Back to Management
          </button>
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
            <Outlet context={{ vehicle }} />
          </div>
        </div>
      </div>
    );
  }
}

function DashboardWrapper(props) {
  const location = useLocation();
  const navigate = useNavigate();
  const vehicle = location.state?.vehicle;

  useEffect(() => {
    if (vehicle) {
      localStorage.setItem("selectedVehicle", JSON.stringify(vehicle));
    }
  }, [vehicle]);

  const storedVehicle =
    vehicle || JSON.parse(localStorage.getItem("selectedVehicle"));

  useEffect(() => {
    if (!storedVehicle) {
      navigate("/management"); // 🚨 仍无 vehicle 则跳回
    } else if (location.pathname === "/dashboard") {
      navigate("/dashboard/schedule", { state: { vehicle: storedVehicle } });
    }
  }, [storedVehicle, location.pathname, navigate]);

  if (!storedVehicle || location.pathname === "/dashboard") {
    return null; // 等待跳转
  }

  return <Dashboard {...props} vehicle={storedVehicle} />;
}

export default DashboardWrapper;
