import React, { Component } from "react";
import "./AddVehicle.css"; // 弹窗样式

class AddVehicle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      vehicleType: "Bus", // 默认值
      error: "",
    };
  }

  handleChange = (e) => {
    this.setState({ vehicleType: e.target.value, error: "" });
  };

  handleSubmit = () => {
    const { vehicleType } = this.state;

    if (!vehicleType) {
      this.setState({ error: "Please select a vehicle type." });
      return;
    }

    const payload = { vehicleType };

    fetch("http://localhost:8080/add/vehicle", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          this.props.onSaveSuccess();
        } else {
          this.setState({ error: "Failed to save." });
        }
      })
      .catch(() => {
        this.setState({ error: "Server error." });
      });
  };

  render() {
    const { vehicleType, error } = this.state;

    return (
      <div className="modal-overlay">
        <div className="modal">
          <span className="close-btn" onClick={this.props.onClose}>
            ❌
          </span>
          <h3>Add Vehicle</h3>
          <div className="form-group">
            <label>Select Vehicle Type:</label>
            <select
              name="vehicleType"
              value={vehicleType}
              onChange={this.handleChange}
            >
              <option value="Bus">Bus</option>
              <option value="Electric Light Rail">Electric Light Rail</option>
              <option value="Diesel Electric Train">
                Diesel Electric Train
              </option>
            </select>

            {error && <p className="error">{error}</p>}

            <div className="full-width">
              <button className="save-button" onClick={this.handleSubmit}>
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AddVehicle;
