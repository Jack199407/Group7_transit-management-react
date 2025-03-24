import React, { Component, useEffect } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import "./Dashboard.css";

class Dashboard extends Component {
  handleBack = () => {
    this.props.navigate("/management");
  };

  render() {
    const { vehicle, routes } = this.props;
    console.log("In dashboard:", routes);

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
          Vehicle Dashboard - ID: <span>{vehicle.id}</span> - Type:
          <span>{vehicle.vehicleType}</span>
          <button className="back-button" onClick={this.handleBack}>
            ← Back to Management
          </button>
        </div>
        <div className="dashboard-body">
          <div className="sidebar">
            <NavLink to="/dashboard/schedule" className="tab-link">
              List Schedule
            </NavLink>
            <NavLink to="/dashboard/energy" className="tab-link">
              Energy/Fuel Consumption
            </NavLink>
            <NavLink to="/dashboard/maintenance" className="tab-link">
              Maintenance
            </NavLink>
            <NavLink to="/dashboard/analytics" className="tab-link">
              Analytics
            </NavLink>
          </div>
          <div className="tab-content">
            <Outlet context={{ vehicle, routes }} />
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
  const routes = location.state?.routes;

  useEffect(() => {
    if (vehicle && routes) {
      localStorage.setItem("selectedVehicle", JSON.stringify(vehicle));
      localStorage.setItem("routesList", JSON.stringify(routes));
    }
  }, [vehicle, routes]);

  const storedVehicle =
    vehicle || JSON.parse(localStorage.getItem("selectedVehicle"));
  const storedRoutes = routes || JSON.parse(localStorage.getItem("routesList"));

  useEffect(() => {
    if (!storedVehicle || !storedRoutes) {
      navigate("/management");
    } else if (location.pathname === "/dashboard") {
      navigate("/dashboard/schedule", {
        state: { vehicle: storedVehicle, routes: storedRoutes },
      });
    }
  }, [storedVehicle, storedRoutes, location.pathname, navigate]);

  if (!storedVehicle || !storedRoutes || location.pathname === "/dashboard") {
    return null;
  }

  return (
    <Dashboard
      {...props}
      vehicle={storedVehicle}
      routes={storedRoutes}
      navigate={navigate}
    />
  );
}

export default DashboardWrapper;
