import React, { useState } from "react";
import { Badge } from "react-bootstrap";

export default function P_ActiveRideContent({ currentTrip, onCompleteTrip }) {
  // Mock data for testing
  const mockTrip = {
    status: "On Trip",
    driverName: "John Smith", 
    vehicle: "Toyota Camry", 
    pickupLocation: "123 Main St",
    dropoffLocation: "456 Oak Ave",
    fare: "25.00",
    eta: "15"
  };

  // Use mock data if no currentTrip provided
  currentTrip = currentTrip || mockTrip;

  const statusVariant = (s) => (s === "On Trip" ? "success" : s === "Rejected" ? "danger" : "warning");

  const cardStyle = {
    position: "relative",
    padding: "1.5rem",
    borderRadius: "12px",
    border: "none",
    background: "linear-gradient(to right, #f8f9fa, #ffffff)",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    margin: "1rem 0"
  };

  const badgeStyle = {
    position: "absolute",
    top: "15px",
    right: "15px",
    fontSize: "0.8rem",
    padding: "0.4rem 0.8rem",
    borderRadius: "20px"
  };

  const metaStyle = {
    marginBottom: "12px",
    color: "#495057",
    fontSize: "1.1rem"
  };

  const headerStyle = {
    color: "#212529",
    fontWeight: "600",
    marginBottom: "1.5rem"
  };

  if (!currentTrip) {
    return <div>No active ride.</div>;
  }

  return (
    <div className="p-4" style={{ width: "100%", maxWidth: "800px", margin: "0 auto" }}>
      <h2 style={headerStyle}>Active Ride</h2>
      <div style={cardStyle}>
        <Badge bg={statusVariant(currentTrip.status)} style={badgeStyle}>{currentTrip.status}</Badge>
        <div style={metaStyle}><strong>Driver:</strong> {currentTrip.driverName}</div>
        <div style={metaStyle}><strong>Vehicle:</strong> {currentTrip.vehicle}</div>
        <div style={metaStyle}><strong>Pickup:</strong> {currentTrip.pickupLocation}</div>
        <div style={metaStyle}><strong>Dropoff:</strong> {currentTrip.dropoffLocation}</div>
        <div style={metaStyle}>
          <strong>Fare:</strong> ${currentTrip.fare} • <strong>ETA:</strong> {currentTrip.eta} mins
        </div>
      </div>
    </div>
  );
}
