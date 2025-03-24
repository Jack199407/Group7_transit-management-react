import React, { Component } from "react";
import { useOutletContext } from "react-router-dom";
import "./ListSchedule.css";

import AddSchedule from "./AddSchedule";

class ListSchedule extends Component {
  constructor(props) {
    super(props);
    this.state = {
      schedules: [],
      showForm: false,
      expectedDepartTime: "",
      expectedArrivalTime: "",
      error: "",
    };
  }

  componentDidMount() {
    this.fetchSchedules();
  }

  fetchSchedules = () => {
    const { vehicle } = this.props;

    fetch("http://localhost:8080/list/schedule", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ vehicleId: vehicle.id }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.data)) {
          this.setState({ schedules: data.data, error: "" });
        } else {
          this.setState({ error: "Invalid data format" });
        }
      })
      .catch(() => {
        this.setState({ error: "Failed to fetch schedules." });
      });
  };

  handleAddSchedule = () => {
    const { expectedDepartTime, expectedArrivalTime } = this.state;
    const { vehicle } = this.props;

    if (!expectedDepartTime || !expectedArrivalTime) {
      this.setState({ error: "Please fill in both times." });
      return;
    }

    const payload = {
      vehicleId: vehicle.id,
      routeId: vehicle.currentAssignedRouteId,
      expectedDepartTime,
      expectedArrivalTime,
    };

    fetch("http://localhost:8080/add/schedule", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          this.setState({
            showForm: false,
            expectedDepartTime: "",
            expectedArrivalTime: "",
            error: "",
          });
          this.fetchSchedules();
        } else {
          this.setState({ error: "Failed to add schedule." });
        }
      })
      .catch(() => {
        this.setState({ error: "Server error while adding schedule." });
      });
  };

  handleStatusChange = (scheduleId, newStatus, currentStatus) => {
    if (newStatus === currentStatus) return;

    fetch("http://localhost:8080/update/status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: scheduleId, status: newStatus }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          this.setState((prevState) => ({
            schedules: prevState.schedules.map((s) =>
              s.id === scheduleId ? { ...s, status: newStatus } : s
            ),
            error: "",
          }));
        } else {
          this.setState({ error: "Failed to update status." });
        }
      })
      .catch(() => {
        this.setState({ error: "Server error while updating status." });
      });
  };

  render() {
    const {
      schedules,
      showForm,
      expectedDepartTime,
      expectedArrivalTime,
      error,
    } = this.state;
    const { vehicle } = this.props;

    return (
      <div className="list-schedule-container">
        <h3>Schedules for Vehicle ID: {vehicle.id}</h3>

        <button
          className="add-schedule-button"
          onClick={() => this.setState({ showModal: true })}
        >
          + Add Schedule
        </button>

        {this.state.showModal && (
          <AddSchedule
            vehicle={vehicle}
            onClose={() => this.setState({ showModal: false })}
            onSaveSuccess={() => {
              this.setState({ showModal: false });
              this.fetchSchedules();
            }}
          />
        )}

        {showForm && (
          <div className="add-schedule-form">
            <label>
              Depart Time:
              <input
                type="datetime-local"
                value={expectedDepartTime}
                onChange={(e) =>
                  this.setState({ expectedDepartTime: e.target.value })
                }
              />
            </label>
            <label>
              Arrival Time:
              <input
                type="datetime-local"
                value={expectedArrivalTime}
                onChange={(e) =>
                  this.setState({ expectedArrivalTime: e.target.value })
                }
              />
            </label>
            <button onClick={this.handleAddSchedule}>Save</button>
          </div>
        )}

        {error && <p className="error">{error}</p>}

        {schedules.length === 0 ? (
          <p className="no-data">No schedules for this vehicle.</p>
        ) : (
          <table className="schedule-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Vehicle ID</th>
                <th>Route ID</th>
                <th>Depart Time</th>
                <th>Arrival Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {schedules.map((s) => (
                <tr key={s.id}>
                  <td>{s.id}</td>
                  <td>{s.vehicleId}</td>
                  <td>{s.routeId}</td>
                  <td>{s.expectedDepartTime}</td>
                  <td>{s.expectedArrivalTime}</td>
                  <td>
                    <select
                      value={s.status}
                      onChange={(e) =>
                        this.handleStatusChange(s.id, e.target.value, s.status)
                      }
                    >
                      <option value="scheduled">scheduled</option>
                      <option value="out of service">out of service</option>
                      <option value="break">break</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    );
  }
}

// 包装类组件，传递 vehicle
function ListScheduleWithContext(props) {
  const { vehicle } = useOutletContext();
  return <ListSchedule {...props} vehicle={vehicle} />;
}

export default ListScheduleWithContext;
