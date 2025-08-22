import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  acceptBooking,
  cancelBooking,   // 👈 import cancelBooking from slice
  checkNewRequests,
} from "../../redux/slice/driver.slice";
import ride from "../../image/ride.png";

const D_NewRideRequestContent = () => {
  const dispatch = useDispatch();
  const { newRequests, loading, error } = useSelector((state) => state.driver);

  console.log(newRequests, "newRequests");

  // Fetch new ride requests when component mounts
  useEffect(() => {
    dispatch(checkNewRequests());
  }, [dispatch]);

  // Handle loading / error state
  if (loading) {
    return (
      <div className="d_tab_page w-100 h-100 p-lg-4 p-2 bg-white rounded-3 shadow-sm border border-light text-center">
        <p className="text-primary">Checking for new ride requests...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="d_tab_page w-100 h-100 p-lg-4 p-2 bg-white rounded-3 shadow-sm border border-light text-center">
        <p className="text-danger">⚠ {error}</p>
      </div>
    );
  }

  // 🔹 Handle case where response contains bookings
  const requests = Array.isArray(newRequests) ? newRequests : [];

  if (requests.length === 0) {
    return (
      <div className="d_tab_page w-100 h-100 p-lg-4 p-2  bg-white rounded-3 shadow-sm border border-light text-center d-flex flex-column align-items-center justify-content-center">
       
       <img src={ride} style={{width:"200px", marginBottom:"10px"}}></img>
        <h2 className="fs-3 fw-bold text-dark mb-lg-4 mb-md-2 mb-1 ">
          No New Ride Requests
        </h2>
        <p className="text-secondary leading-normal">
          You're all caught up! Waiting for new ride requests to come in.
        </p>
      </div>
    );
  }

  return (
    <div className="d_tab_page w-100 h-100 p-lg-4 p-2 bg-white rounded-3 shadow-sm border border-light">
      <h2 className="fs-3 fw-bold text-dark mb-lg-4 mb-md-2 mb-1">
        New Ride Requests
      </h2>
      <p className="text-secondary leading-normal mb-lg-4 mb-md-2 mb-1">
        Review details of incoming ride requests and decide whether to accept or
        decline.
      </p>

      {requests.map((rideRequest) => (
        <div
          key={rideRequest._id}
          className="bg-success-subtle p-3 rounded-2 border border-success-subtle mb-3"
        >
          <p className="fw-semibold text-success-emphasis">
            Ride ID: {rideRequest._id}
          </p>
          <p className="text-success">Pickup: {rideRequest.pickup?.address}</p>
          <p className="text-success">Drop-off: {rideRequest.drop?.address}</p>
          <p className="text-success">
            Vehicle: {rideRequest.vehicleType} (
            {rideRequest.preferredVehicleModel})
          </p>
          <p className="text-success">
            Distance: {rideRequest.fareDetails?.distance} km
          </p>
          <p className="text-success">
            Estimated Fare: ${rideRequest.fare?.toFixed(2)}
          </p>
          <p className="text-success">
            Status:{" "}
            <span
              className={`fw-bold ${
                rideRequest.status === "cancelled"
                  ? "text-danger"
                  : "text-success"
              }`}
            >
              {rideRequest.status}
            </span>
          </p>
          <div className="d-flex justify-content-end gap-2 mt-3">
            <button
              className="btn btn-danger px-4 py-2 rounded-2 fw-semibold"
              onClick={() => dispatch(cancelBooking(rideRequest._id))} // 👈 cancelBooking call
            >
              Decline
            </button>
            <button
              className="btn text-white px-4 py-2 rounded-2 fw-semibold"
              style={{ backgroundColor: "#0f6e55" }}
              onClick={() => dispatch(acceptBooking(rideRequest._id))}
            >
              Accept Ride
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default D_NewRideRequestContent;
