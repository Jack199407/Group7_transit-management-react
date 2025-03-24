import React, { Component } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import "./ListSchedule.css";
import AddSchedule from "./AddSchedule";

class ListSchedule extends Component {
  constructor(props) {
    super(props);
    this.state = {
      schedules: [],
      showModal: false,
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

  goToTracks = (schedule) => {
    this.props.navigate("track", {
      state: { schedule },
    });
  };

  render() {
    const { schedules, showModal, error } = this.state;
    const { vehicle, routes } = this.props;
    console.log("In listSchedule", routes);

    const routeMap = new Map(routes.map((route) => [route.id, route]));

    return (
      <div className="list-schedule-container">
        <h3>Schedules for Vehicle ID: {vehicle.id}</h3>

        <button
          className="add-schedule-button"
          onClick={() => this.setState({ showModal: true })}
        >
          + Add Schedule
        </button>

        {showModal && (
          <AddSchedule
            vehicle={vehicle}
            onClose={() => this.setState({ showModal: false })}
            onSaveSuccess={() => {
              this.setState({ showModal: false });
              this.fetchSchedules();
            }}
          />
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
                <th>Route</th>
                <th>Depart Time</th>
                <th>Arrival Time</th>
                <th>Status</th>
                <th>GPS Tracks</th>
              </tr>
            </thead>
            <tbody>
              {schedules.map((s) => (
                <tr key={s.id}>
                  <td>{s.id}</td>
                  <td>{s.vehicleId}</td>
                  <td>{routeMap.get(s.routeId).routeName}</td>
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
                  <td>
                    <button
                      className="detail-button"
                      onClick={() => this.goToTracks(s)}
                    >
                      Tracks
                    </button>
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

// 包装获取 navigate 和 vehicle
function ListScheduleWithContext(props) {
  const { vehicle, routes } = useOutletContext();
  const navigate = useNavigate();
  return (
    <ListSchedule
      {...props}
      vehicle={vehicle}
      routes={routes}
      navigate={navigate}
    />
  );
}

export default ListScheduleWithContext;
