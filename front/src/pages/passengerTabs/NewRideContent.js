import React, { useState } from "react";
import { Badge, Button } from "react-bootstrap";

export default function P_MyRides() {
  const [myRides, setMyRides] = useState([
    { id: 1, driverName: "John Doe", vehicle: "Sedan", pickupLocation: "123 Main St", dropoffLocation: "456 Park Ave", fare: 25, eta: 15, status: "Pending" },
    { id: 2, driverName: "Jane Smith", vehicle: "SUV", pickupLocation: "789 Elm St", dropoffLocation: "321 Oak St", fare: 40, eta: 20, status: "Accepted" },
    { id: 3, driverName: "Mike Lee", vehicle: "Hatchback", pickupLocation: "555 Pine St", dropoffLocation: "888 Maple St", fare: 18, eta: 10, status: "Rejected" },
  ]);

  const statusVariant = (s) =>
    s === "Accepted" ? "success" : s === "Rejected" ? "danger" : "warning";

  const cancelRide = (id) => {
    // Update the ride status to "Cancelled"
    setMyRides((prevRides) =>
      prevRides.map((ride) =>
        ride.id === id ? { ...ride, status: "Cancelled" } : ride
      )
    );
  };

  const containerStyle = {
    maxHeight: "75vh",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  };
  const cardStyle = {
    position: "relative",
    padding: "1rem",
    borderRadius: 8,
    border: "1px solid #eee",
    background: "#fff",
    boxShadow: "0 1px 6px rgba(0,0,0,0.04)",
  };
  const badgeStyle = {
    position: "absolute",
    top: 12,
    right: 12,
    fontSize: "0.75rem",
    padding: "0.35rem 0.5rem",
  };
  const metaStyle = { marginBottom: 6, color: "#333" };

  return (
    <div className="p-3" style={{ width: "100%" }}>
      <h2 className="mb-3">My Rides</h2>

      <div style={containerStyle}>
        {myRides.map((ride) => (
          <div key={ride.id} style={cardStyle}>
            <Badge bg={statusVariant(ride.status)} style={badgeStyle}>
              {ride.status}
            </Badge>

            <div style={metaStyle}>
              <strong>Driver:</strong> {ride.driverName}
            </div>
            <div style={metaStyle}>
              <strong>Vehicle:</strong> {ride.vehicle}
            </div>
            <div style={metaStyle}>
              <strong>Pickup:</strong> {ride.pickupLocation}
            </div>
            <div style={metaStyle}>
              <strong>Dropoff:</strong> {ride.dropoffLocation}
            </div>
            <div style={metaStyle}>
              <strong>Fare:</strong> ${ride.fare} • <strong>ETA:</strong>{" "}
              {ride.eta} mins
            </div>

            {/* Show Cancel button only if Pending or Accepted */}
            {(ride.status === "Pending" || ride.status === "Accepted") && (
              <Button
                variant="danger"
                size="sm"
                onClick={() => cancelRide(ride.id)}
              >
                Cancel Ride
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
