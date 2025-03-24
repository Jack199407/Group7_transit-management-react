import React, { Component } from "react";
import { useNavigate } from "react-router-dom";
import AddVehicle from "../../components/AddVehicle"; // 弹窗组件
import "./Management.css";

class Management extends Component {
  constructor(props) {
    super(props);
    this.state = {
      vehicles: [],
      currentPage: 1,
      vehiclesPerPage: 10,
      error: "",
      showModal: false,
    };
  }

  componentDidMount() {
    this.fetchVehicleData();
  }

  fetchVehicleData = () => {
    fetch("http://localhost:8080/list/vehicle", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((data) => {
        const arr = data.data;
        if (Array.isArray(arr)) {
          const sorted = arr.sort((a, b) => b.id - a.id);
          this.setState({ vehicles: sorted });
        } else {
          this.setState({ error: "Invalid data format" });
        }
      })
      .catch(() => {
        this.setState({ error: "Failed to fetch data" });
      });
  };

  handlePageChange = (pageNumber) => {
    this.setState({ currentPage: pageNumber });
  };

  toggleModal = () => {
    this.setState((prevState) => ({ showModal: !prevState.showModal }));
  };

  handleAssignRoute = (vehicleId, routeId) => {
    const payload = { vehicleId, routeId };

    fetch("http://localhost:8080/assign/route", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          this.fetchVehicleData();
        } else {
          alert("Assign Fail");
        }
      })
      .catch(() => {
        alert("Server Error");
      });
  };

  renderPagination = (totalPages) => {
    const { currentPage } = this.state;
    const pages = [];

    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => this.handlePageChange(i)}
          className={i === currentPage ? "active-page" : ""}
        >
          {i}
        </button>
      );
    }

    return <div className="pagination">{pages}</div>;
  };

  goToDetail = (vehicle) => {
    this.props.navigate("/dashboard", {
      state: { vehicle },
    });
  };

  render() {
    const { vehicles, currentPage, vehiclesPerPage, error, showModal } =
      this.state;

    const indexOfLast = currentPage * vehiclesPerPage;
    const indexOfFirst = indexOfLast - vehiclesPerPage;
    const currentVehicles = vehicles.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(vehicles.length / vehiclesPerPage);

    return (
      <div className="management-container">
        <h2>Vehicle Management</h2>

        <div className="management-buttons">
          <button
            className="logout-button"
            onClick={() => this.props.navigate("/login")}
          >
            Logout
          </button>

          <button className="add-button" onClick={this.toggleModal}>
            + Add Vehicle
          </button>
        </div>

        {error && <p className="error">{error}</p>}

        {vehicles.length === 0 && !error ? (
          <p className="no-data">No vehicles</p>
        ) : (
          <>
            <table className="vehicle-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>ID</th>
                  <th>Vehicle Type</th>
                  <th>Fuel Type</th>
                  <th>Fuel Consumption Rate</th>
                  <th>Max Passengers</th>
                  <th>Assigned Route ID</th>
                  <th>Total Miles</th>
                  <th>Total Consumption</th>
                  <th>Maintain Gap Miles</th>
                  <th>Miles From Last Maintenance</th>
                  <th>Need Maintenance</th>
                  <th>More Details</th>
                </tr>
              </thead>
              <tbody>
                {currentVehicles.map((vehicle, index) => (
                  <tr key={vehicle.id}>
                    <td>{(currentPage - 1) * vehiclesPerPage + index + 1}</td>
                    <td>{vehicle.id}</td>
                    <td>{vehicle.vehicleType}</td>
                    <td>{vehicle.fuelType}</td>
                    <td>{vehicle.fuelConsumptionRate}</td>
                    <td>{vehicle.maxPassengers}</td>
                    <td>
                      <div className="route-assign">
                        {vehicle.currentAssignedRouteId == null
                          ? "Unassigned"
                          : vehicle.currentAssignedRouteId}
                        <select
                          onChange={(e) =>
                            this.handleAssignRoute(
                              vehicle.id,
                              parseInt(e.target.value)
                            )
                          }
                          value=""
                        >
                          <option value="" disabled>
                            {vehicle.currentAssignedRouteId == null
                              ? "Assign Route"
                              : "Change Route"}
                          </option>
                          {[1, 2, 3, 4, 5].map((num) => (
                            <option key={num} value={num}>
                              {num}
                            </option>
                          ))}
                        </select>
                      </div>
                    </td>
                    <td>{vehicle.realTotalMiles}</td>
                    <td>{vehicle.realTotalConsumption}</td>
                    <td>{vehicle.maintainGapMiles}</td>
                    <td>{vehicle.milesFromLastMaintenance}</td>
                    <td>{vehicle.needMaintenance ? "Yes" : "No"}</td>
                    <td>
                      <button
                        className="detail-button"
                        onClick={() => this.goToDetail(vehicle)}
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {totalPages > 1 && this.renderPagination(totalPages)}
          </>
        )}

        {showModal && (
          <AddVehicle
            onClose={this.toggleModal}
            onSaveSuccess={() => {
              this.toggleModal();
              this.fetchVehicleData();
            }}
          />
        )}
      </div>
    );
  }
}

function WithNavigate(props) {
  const navigate = useNavigate();
  return <Management {...props} navigate={navigate} />;
}

export default WithNavigate;
