import React, { Component } from "react";
import { useOutletContext } from "react-router-dom";
import "./Maintenance.css";

class Maintenance extends Component {
  constructor(props) {
    super(props);
    this.state = {
      maintenance: null,
      error: "",
      showModal: false,
      newMaintainTime: "",
    };
  }

  componentDidMount() {
    const { vehicle } = this.props;
    if (!vehicle) return;

    this.fetchMaintenance(vehicle.id);
  }

  fetchMaintenance = (vehicleId) => {
    fetch("http://localhost:8080/list/maintain", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ vehicleId }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          this.setState({ maintenance: data.data });
        } else {
          this.setState({ error: "Failed to load maintenance data." });
        }
      })
      .catch(() => {
        this.setState({ error: "Server error." });
      });
  };

  handleAddRecord = () => {
    this.setState({ showModal: true });
  };

  handleSave = () => {
    const { vehicle } = this.props;
    const { newMaintainTime } = this.state;

    if (!newMaintainTime) return;

    const payload = {
      vehicleId: vehicle.id,
      maintainTime: newMaintainTime,
    };

    fetch("http://localhost:8080/add/maintain", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          this.setState({
            showModal: false,
            newMaintainTime: "",
          });
          this.fetchMaintenance(vehicle.id); // refresh
        } else {
          alert("Failed to add record.");
        }
      })
      .catch(() => {
        alert("Server error.");
      });
  };

  render() {
    const { maintenance, error, showModal, newMaintainTime } = this.state;

    if (error) {
      return <div className="error">{error}</div>;
    }

    if (!maintenance) {
      return <div className="loading">Loading maintenance info...</div>;
    }

    return (
      <div className="maintenance-container">
        <h2>🛠 Maintenance Info</h2>

        <div className="maintenance-item">
          <span className="label">Vehicle ID:</span>
          <span>{maintenance.vehicleId}</span>
        </div>

        <div className="maintenance-item">
          <span className="label">Need Maintenance:</span>
          <span>{maintenance.needMaintain ? "Yes" : "No"}</span>
        </div>

        <div className="maintenance-item">
          <span className="label">Records:</span>
          {maintenance.records && maintenance.records.length > 0 ? (
            <ul className="record-list">
              {maintenance.records.map((record, index) => (
                <li key={index}>
                  {new Date(record.maintainTime).toLocaleString()}
                </li>
              ))}
            </ul>
          ) : (
            <span>No maintenance records.</span>
          )}
        </div>

        <button className="add-record-button" onClick={this.handleAddRecord}>
          + Add Maintenance Record
        </button>

        {showModal && (
          <div className="modal-overlay">
            <div className="modal">
              <h3>Add New Maintenance Record</h3>
              <label>
                Maintain Time:
                <input
                  type="datetime-local"
                  value={newMaintainTime}
                  onChange={(e) =>
                    this.setState({ newMaintainTime: e.target.value })
                  }
                />
              </label>
              <div className="modal-actions">
                <button onClick={this.handleSave}>Save</button>
                <button
                  onClick={() =>
                    this.setState({ showModal: false, newMaintainTime: "" })
                  }
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

function MaintenanceWithContext(props) {
  const { vehicle } = useOutletContext();
  return <Maintenance {...props} vehicle={vehicle} />;
}

export default MaintenanceWithContext;
