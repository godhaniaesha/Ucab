import React, { useState, useEffect } from "react";
import { Modal, Button, Badge } from "react-bootstrap";
import { FaEye } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { getVehicles } from "../../redux/slice/vehicles.slice";

export default function SA_ManageVehiclesContent() {
  const [db_selectedVehicle, db_setSelectedVehicle] = useState(null);
  const [db_showModal, db_setShowModal] = useState(false);

  const dispatch = useDispatch();
    const { vehicles = [], loading = false } = useSelector(
      (state) => state.vehicle || {}
    );
  // Add comment explaining the vehicles data structure
  /* 
  Vehicles array contains objects with structure:
  {
    images: Array,
    description: string,
    _id: string,
    provider: Object,
    make: string,
    model: string,
    ...other fields
  }
  */

  

  useEffect(() => {
    dispatch(getVehicles());
  }, [dispatch]);

  const db_handleView = (vehicle) => {
    db_setSelectedVehicle(vehicle);
    db_setShowModal(true);
  };

  return (
    <div className="d_tab_page w-100 h-100 p-lg-4 p-2 bg-white rounded-3 border border-light shadow-sm w-100">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fs-3 fw-bold text-dark mb-1">Manage Vehicles</h2>
          <p className="text-secondary">
            View, approve, or edit vehicles registered on the platform.
          </p>
        </div>
      </div>

      {/* Table */}
      <div
        className="table"
        style={{ maxHeight: "400px", overflow: "auto", width: "95%" }}
      >
        <table className="table align-middle table-hover text-nowrap">
          <thead className="bg-dark text-white sticky-top">
            <tr>
              <th>#</th>
              <th>Provider</th>
              <th>Vehicle</th>
              <th>Type</th>
              <th>Rate/Km</th>
              <th>Extra/Km</th>
              <th>Joined</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map((vehicle, index) => (
              <tr key={vehicle._id}>
                <td>{index + 1}</td>
                <td>{vehicle.provider.name}</td>
                <td>
                  {vehicle.make} {vehicle.model} ({vehicle.year})
                </td>
                <td>
                  <Badge bg="secondary">{vehicle.type.toUpperCase()}</Badge>
                </td>
                <td>${vehicle.perKmRate}</td>
                <td>${vehicle.extraKmRate}</td>
                <td>{new Date(vehicle.createdAt).toLocaleDateString()}</td>
                <td>
                  <Button
                    style={{
                      backgroundColor: "rgb(21, 136, 109)",
                      border: "none",
                    }}
                    size="sm"
                    onClick={() => db_handleView(vehicle)}
                  >
                    <FaEye className="mb-1" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        show={db_showModal}
        onHide={() => db_setShowModal(false)}
        size="lg"
        centered
        contentClassName="d_modal_content"
      >
        <Modal.Header closeButton className="d_modal_header">
          <Modal.Title className="d_modal_title">Vehicle Details</Modal.Title>
        </Modal.Header>
        <Modal.Body className="d_modal_body">
          {db_selectedVehicle && (
            <div className="d_vehicle_modal_wrapper d-flex flex-column flex-lg-row gap-3">
              {/* Left Column: Info */}
              <div className="flex-grow-1 d-flex flex-column gap-3">
                {/* Vehicle Header */}
                <div className="d_card p-3 border rounded shadow-sm">
                  <h4 className="mb-2">
                    {db_selectedVehicle.make} {db_selectedVehicle.model} (
                    {db_selectedVehicle.year})
                  </h4>
                  <p className="mb-1">Provider: <strong>{db_selectedVehicle.provider.name}</strong></p>
                  <p className="mb-1">Plate: <strong>{db_selectedVehicle.plate}</strong></p>
                  <Badge bg="secondary">{db_selectedVehicle.type.toUpperCase()}</Badge>
                </div>

                {/* Vehicle Specs */}
                <div className="d_card p-3 border rounded shadow-sm">
                  <h6 className="mb-2">Vehicle Specifications</h6>
                  <p>Doors: {db_selectedVehicle.taxiDoors}</p>
                  <p>Passengers: {db_selectedVehicle.passengers}</p>
                  <p>Luggage Capacity: {db_selectedVehicle.luggageCarry}</p>
                  <p>Air Conditioning: {db_selectedVehicle.airCondition ? "Yes" : "No"}</p>
                  <p>GPS Navigation: {db_selectedVehicle.gpsNavigation ? "Yes" : "No"}</p>
                </div>

                {/* Pricing */}
                <div className="d_card p-3 border rounded shadow-sm">
                  <h6 className="mb-2">Pricing</h6>
                  <p>Rate per Km: ${db_selectedVehicle.perKmRate}</p>
                  <p>Extra Km Rate: ${db_selectedVehicle.extraKmRate}</p>
                </div>
              </div>

              {/* Right Column: Images */}
              {db_selectedVehicle.images?.length > 0 && (
                <div className="d_images_column flex-shrink-0">
                  <h6 className="mb-2">Images</h6>
                  <div className="d_images_wrapper d-flex flex-column gap-2">
                    {db_selectedVehicle.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={`http://localhost:5000${img}`} alt={`Vehicle ${idx}`}
                        style={{
                          width: 200,
                          height: 120,
                          objectFit: "cover",
                          borderRadius: 8,
                          border: "1px solid #ccc",
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
}
