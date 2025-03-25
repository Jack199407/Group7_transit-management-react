import React, { Component } from "react";
import { useOutletContext } from "react-router-dom";
import "./EnergyConsumption.css";

class EnergyConsumption extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      error: "",
    };
  }

  componentDidMount() {
    const { vehicle } = this.props;

    fetch("http://localhost:8080/energy/monitor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ vehicleId: vehicle.id }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          this.setState({ data: data.data });
        } else {
          this.setState({ error: "Failed to load energy data." });
        }
      })
      .catch(() => {
        this.setState({ error: "Server error." });
      });
  }

  render() {
    const { data, error } = this.state;

    if (error) return <div className="energy-error">{error}</div>;
    if (!data) return <div className="energy-loading">Loading...</div>;

    return (
      <div className="energy-container">
        <h3>Energy Monitoring for Vehicle ID: {data.vehicleId}</h3>
        <div className="energy-info">
          <div className="energy-row">
            <span className="key">Fuel Type:</span>
            <span className="value">{data.fuelType}</span>
          </div>
          <div className="energy-row">
            <span className="key">Total Miles:</span>
            <span className="value">{data.realTotalMiles}</span>
          </div>
          <div className="energy-row">
            <span className="key">Total Consumption:</span>
            <span className="value">{data.realTotalConsumption}</span>
          </div>
          <div className="energy-row">
            <span className="key">Consumption Rate:</span>
            <span className="value">{data.fuelConsumptionRate}</span>
          </div>
          <div className="energy-row">
            <span className="key">Min Consumption:</span>
            <span className="value">{data.minConsumption}</span>
          </div>
          <div className="energy-row">
            <span className="key">Max Consumption:</span>
            <span className="value">{data.maxConsumption}</span>
          </div>
          <div className="energy-row">
            <span className="key">Status:</span>
            <span
              className="value"
              style={{ color: data.normal ? "lime" : "red" }}
            >
              {data.normal ? "Normal" : "Abnormal"}
            </span>
          </div>
        </div>
      </div>
    );
  }
}

function EnergyConsumptionWithContext(props) {
  const { vehicle } = useOutletContext();
  return <EnergyConsumption {...props} vehicle={vehicle} />;
}

export default EnergyConsumptionWithContext;
