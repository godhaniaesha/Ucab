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
    <div className="p-3 d_tab_page w-100  h-100 p-lg-4 p-2 bg-white rounded-3 shadow-sm border border-light ">
      <h2 className="fs-3 fw-bold text-dark mb-lg-4 mb-md-2 mb-1">My Rides</h2>

      <div style={containerStyle}>
        {bookings.map((booking) => (
          <div key={booking._id} style={cardStyle}>
            <Badge bg={statusVariant(booking.status)} style={badgeStyle}>
              {booking.status}
            </Badge>

            <div className="mt-sm-0 mt-2" style={metaStyle}>
              <strong>Pickup:</strong> {booking.pickup?.address || "N/A"}
            </div>
            <div style={metaStyle}>
              <strong>Dropoff:</strong> {booking.drop?.address || "N/A"}
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
