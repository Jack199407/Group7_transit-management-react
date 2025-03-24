import React, { Component } from "react";
import "./AddSchedule.css";

class AddSchedule extends Component {
  constructor(props) {
    super(props);
    this.state = {
      departTime: "",
      arrivalTime: "",
      error: "",
    };
  }

  handleSave = () => {
    const { departTime, arrivalTime } = this.state;
    const { vehicle, onSaveSuccess } = this.props;

    if (!departTime || !arrivalTime) {
      this.setState({ error: "Please fill in both times." });
      return;
    }

    const payload = {
      vehicleId: vehicle.id,
      routeId: vehicle.currentAssignedRouteId,
      expectedDepartTime: departTime,
      expectedArrivalTime: arrivalTime,
    };

    fetch("http://localhost:8080/add/schedule", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          onSaveSuccess(); // 通知父组件刷新数据并关闭弹窗
        } else {
          this.setState({ error: "Add failed." });
        }
      })
      .catch(() => {
        this.setState({ error: "Server error while adding schedule." });
      });
  };

  render() {
    const { departTime, arrivalTime, error } = this.state;
    const { vehicle, onClose } = this.props;

    return (
      <div className="add-schedule-overlay">
        <div className="add-schedule-modal">
          <div className="modal-header">
            <h3>Add Schedule</h3>
            <button className="close-button" onClick={onClose}>
              ❌
            </button>
          </div>

          <div className="modal-body">
            <p>
              <strong>Vehicle ID:</strong> {vehicle.id}
            </p>
            <p>
              <strong>Route ID:</strong> {vehicle.currentAssignedRouteId}
            </p>

            <label>
              Depart Time:
              <input
                type="datetime-local"
                value={departTime}
                onChange={(e) => this.setState({ departTime: e.target.value })}
              />
            </label>

            <label>
              Arrival Time:
              <input
                type="datetime-local"
                value={arrivalTime}
                onChange={(e) => this.setState({ arrivalTime: e.target.value })}
              />
            </label>

            {error && <p className="error">{error}</p>}

            <button className="save-button" onClick={this.handleSave}>
              Save
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default AddSchedule;
