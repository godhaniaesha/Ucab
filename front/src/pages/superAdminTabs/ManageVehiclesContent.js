import React, { useState } from "react";
import { Modal, Button, Badge } from "react-bootstrap";
import { FaEye } from "react-icons/fa";

export default function SA_ManageVehiclesContent() {
  const [db_selectedVehicle, db_setSelectedVehicle] = useState(null);
  const [db_showModal, db_setShowModal] = useState(false);

  // 🔹 Sample vehicles (matching VehicleSchema)
  const db_vehicles = [
    {
      id: 1,
      providerName: "John Doe",
      make: "Toyota",
      model: "Camry",
      year: 2020,
      plate: "ABC123",
      type: "standard",
      taxiDoors: 4,
      passengers: 4,
      luggageCarry: 2,
      airCondition: true,
      gpsNavigation: true,
      perKmRate: 10,
      extraKmRate: 2,
      images: ["/car1.png", "/car2.png"],
      createdAt: "2025-08-01",
    },
    {
      id: 2,
      providerName: "Jane Smith",
      make: "Honda",
      model: "Civic",
      year: 2021,
      plate: "XYZ987",
      type: "premium",
      taxiDoors: 4,
      passengers: 4,
      luggageCarry: 3,
      airCondition: true,
      gpsNavigation: true,
      perKmRate: 15,
      extraKmRate: 3,
      images: ["/car3.png"],
      createdAt: "2025-07-15",
    },
  ];

  const db_handleView = (vehicle) => {
    db_setSelectedVehicle(vehicle);
    db_setShowModal(true);
  };

  return (
    <div className="d_tab_page p-lg-4 p-2 bg-white rounded-3 border border-light shadow-sm w-100">
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
            {db_vehicles.map((vehicle, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{vehicle.providerName}</td>
                <td>
                  {vehicle.make} {vehicle.model} ({vehicle.year})
                </td>
                <td>
                  <Badge bg="secondary">{vehicle.type.toUpperCase()}</Badge>
                </td>
                <td>${vehicle.perKmRate}</td>
                <td>${vehicle.extraKmRate}</td>
                <td>{vehicle.createdAt}</td>
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
            <p className="mb-1">Provider: <strong>{db_selectedVehicle.providerName}</strong></p>
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
                  src={img}
                  alt={`Vehicle ${idx}`}
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
