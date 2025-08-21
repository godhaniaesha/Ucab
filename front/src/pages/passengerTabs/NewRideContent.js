import React, { useEffect } from "react";
import { Badge, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { getBookings } from "../../redux/slice/passengers.slice";

export default function P_MyRides() {
  const dispatch = useDispatch();
  const { bookings, loading, error } = useSelector((state) => state.passenger);
  console.log(bookings,"sxdhfjgfyjk");

  useEffect(() => {
    dispatch(getBookings());
  }, [dispatch]);

  const statusVariant = (s) =>
    s === "Accepted" ? "success" : s === "Rejected" ? "danger" : "warning";

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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-3" style={{ width: "100%" }}>
      <h2 className="mb-3">My Rides</h2>

      <div style={containerStyle}>
        {bookings.map((booking) => (
          <div key={booking._id} style={cardStyle}>
            <Badge bg={statusVariant(booking.status)} style={badgeStyle}>
              {booking.status}
            </Badge>

            <div style={metaStyle}>
              <strong>Pickup:</strong> {booking.pickup.address}
            </div>
            <div style={metaStyle}>
              <strong>Dropoff:</strong> {booking.drop.address}
            </div>
            <div style={metaStyle}>
              <strong>Vehicle Type:</strong> {booking.vehicleType}
            </div>
            {booking.preferredVehicleModel && (
              <div style={metaStyle}>
                <strong>Vehicle Model:</strong> {booking.preferredVehicleModel}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
