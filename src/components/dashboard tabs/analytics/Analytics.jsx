import React, { Component } from "react";
import { useOutletContext } from "react-router-dom";
import "./Analytics.css";

class Analytics extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      error: "",
    };
  }

  componentDidMount() {
    const { vehicle } = this.props;

    fetch("http://localhost:8080/query/analytic", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ vehicleId: vehicle.id }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          this.setState({ data: data.data, error: "" });
        } else {
          this.setState({ error: "Failed to load analytics data." });
        }
      })
      .catch(() => {
        this.setState({ error: "Server error" });
      });
  }

  render() {
    const { data, error } = this.state;

    return (
      <div className="analytics-container">
        <h2>Analytics Overview</h2>
        {error && <p className="error">{error}</p>}

        {data ? (
          <div className="analytics-content">
            <div className="analytics-item">
              <strong>Total Miles:</strong> {data.realTotalMiles}
            </div>
            <div className="analytics-item">
              <strong>Total Consumption:</strong> {data.realTotalConsumption}
            </div>
            <div className="analytics-item">
              <strong>Status:</strong>{" "}
              {data.normal ? "✅ Normal" : "⚠️ Abnormal"}
            </div>
            <div className="analytics-item">
              <strong>Maintenance Needed:</strong>{" "}
              {data.needMaintain ? "🛠️ Yes" : "✅ No"}
            </div>
            <div className="analytics-item">
              <strong>Maintenance Count:</strong> {data.maintainCount}
            </div>
          </div>
        ) : (
          !error && <p className="loading">Loading analytics data...</p>
        )}
      </div>
    );
  }
}

function AnalyticsWithContext(props) {
  const { vehicle } = useOutletContext();
  return <Analytics {...props} vehicle={vehicle} />;
}

export default AnalyticsWithContext;
