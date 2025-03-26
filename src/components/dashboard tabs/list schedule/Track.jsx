import React, { Component, useContext } from "react";
import { useLocation } from "react-router-dom";
import { UserContext } from "../../../context/UserContext";
import dayjs from "dayjs";
import "./Track.css";

class Track extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tracks: [],
      error: "",
      edited: {},
    };
  }

  componentDidMount() {
    const { schedule } = this.props;
    const cleanSchedule = {
      ...schedule,
      expectedDepartTime: new Date(schedule.expectedDepartTime).toISOString(),
      expectedArrivalTime: new Date(schedule.expectedArrivalTime).toISOString(),
    };

    fetch("http://localhost:8080/list/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cleanSchedule),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          const sortedTracks = data.data.sort(
            (a, b) => a.stationOrder - b.stationOrder
          );
          this.setState({ tracks: sortedTracks });
        } else {
          this.setState({ error: "Invalid track data received." });
        }
      })
      .catch(() => {
        this.setState({ error: "Failed to fetch track data." });
      });
  }

  handleChange = (index, field, value) => {
    const updatedTracks = [...this.state.tracks];
    updatedTracks[index][field] = value;
    this.setState({ tracks: updatedTracks });
  };

  isSavable = (track) => {
    return (
      track.departTime &&
      track.arrivalTime &&
      Number(track.realMiles) > 0 &&
      Number(track.realConsumption) > 0
    );
  };

  handleSave = async (index, vehicle) => {
    const row = this.state.tracks[index];
    const { departTime, arrivalTime, realMiles, realConsumption } = row;
    const { user } = this.props;
    if (!user || user.roleType !== 0) {
      alert("⚠️ You do not have permission to do this.");
      return;
    }
    if (!departTime || !arrivalTime || !realMiles || !realConsumption) {
      alert("Please complete all required fields.");
      return;
    }

    const { id } = vehicle;

    const payload = {
      scheduleId: row.scheduleId,
      stationId: row.stationId,
      departTime,
      arrivalTime,
      realMiles,
      realConsumption,
      vehicleId: id,
    };
    console.log("payload", payload);
    const cleanPayload = {
      ...payload,
      departTime: new Date(departTime).toISOString(),
      arrivalTime: new Date(arrivalTime).toISOString(),
    };
    try {
      const response = await fetch("http://localhost:8080/add/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cleanPayload),
      });

      const data = await response.json();
      if (data.success) {
        const newTracks = [...this.state.tracks];
        newTracks[index].done = true;
        this.setState({ tracks: newTracks });
      } else {
        alert("Save failed. Server returned false.");
      }
    } catch (error) {
      console.error("Save failed:", error);
      alert("Error saving track data.");
    }
  };

  render() {
    const formatDate = (isoString) => {
      const date = new Date(isoString);
      return date.toLocaleString("en-US", {
        year: "numeric",
        month: "short", // Mar
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    };
    function convertToInputFormat(str) {
      const date = new Date(str);
      return dayjs(date).format("YYYY-MM-DDTHH:mm");
    }
    const { schedule, vehicle } = this.props;
    const { tracks, error } = this.state;

    return (
      <div className="track-container">
        <p>Depart: {formatDate(schedule.expectedDepartTime)}</p>
        <p>Arrival: {formatDate(schedule.expectedArrivalTime)}</p>

        {error && <p className="error">{error}</p>}

        <table className="track-table">
          <thead>
            <tr>
              <th>Route Name</th>
              <th>Station Name</th>
              <th>Station Order</th>
              <th>Depart Time</th>
              <th>Arrival Time</th>
              <th>Real Miles</th>
              <th>Real Consumption</th>
              <th>Done</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {tracks.map((track, index) => (
              <tr key={index}>
                <td>{track.routeName}</td>
                <td>{track.stationName}</td>
                <td>{track.stationOrder}</td>
                <td>
                  <input
                    type="datetime-local"
                    value={convertToInputFormat(track.departTime) || ""}
                    onChange={(e) =>
                      this.handleChange(index, "departTime", e.target.value)
                    }
                    placeholder="No information"
                  />
                </td>
                <td>
                  <input
                    type="datetime-local"
                    value={convertToInputFormat(track.arrivalTime) || ""}
                    onChange={(e) =>
                      this.handleChange(index, "arrivalTime", e.target.value)
                    }
                    placeholder="No information"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    min="0"
                    value={track.realMiles || 0}
                    onChange={(e) =>
                      this.handleChange(index, "realMiles", e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    type="number"
                    min="0"
                    value={track.realConsumption || 0}
                    onChange={(e) =>
                      this.handleChange(
                        index,
                        "realConsumption",
                        e.target.value
                      )
                    }
                  />
                </td>
                <td>{track.done ? "Arrived" : "Not Arrived"}</td>
                <td>
                  <button
                    className="save-button"
                    disabled={
                      !track.departTime ||
                      !track.arrivalTime ||
                      Number(track.realMiles) <= 0 ||
                      Number(track.realConsumption) <= 0
                    }
                    onClick={() => this.handleSave(index, vehicle)}
                  >
                    Save
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

function TrackWrapper(props) {
  const location = useLocation();
  const schedule = location.state?.schedule;
  const vehicle = location.state?.vehicle;
  const { user } = useContext(UserContext);
  console.log("schedule", schedule);
  console.log("vehicle", vehicle);

  return <Track {...props} schedule={schedule} vehicle={vehicle} user={user} />;
}

export default TrackWrapper;
