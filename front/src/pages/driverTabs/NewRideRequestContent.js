import React from "react";

const D_NewRideRequestContent = ({ rideRequest, onAccept, onDecline }) => {
  // ...existing code...
  if (!rideRequest) {
    return (
      <div className="d_tab_page p-lg-4 p-2 bg-white rounded-3 shadow-sm border border-light text-center">
        <h2 className="fs-3 fw-bold text-dark mb-lg-4 mb-md-2 mb-1">No New Ride Requests</h2>
        <p className="text-secondary leading-normal">
          You're all caught up! Waiting for new ride requests to come in.
        </p>
      </div>
    );
  }

  return (
    <div className="d_tab_page p-lg-4 p-2 bg-white rounded-3 shadow-sm border border-light">
      <h2 className="fs-3 fw-bold text-dark mb-lg-4 mb-md-2 mb-1">New Ride Request!</h2>
      <p className="text-secondary leading-normal mb-lg-4 mb-md-2 mb-1">
        A new ride request has come in. Review the details and decide whether to
        accept or decline.
      </p>
      <div className="bg-success-subtle p-3 rounded-2 border border-success-subtle mb-lg-4 mb-md-2 mb-1">
        <p className="fw-semibold text-success-emphasis">
          Passenger: {rideRequest.passengerName}
        </p>
        <p className="text-success">
          Pickup: {rideRequest.pickupLocation} ({rideRequest.distanceAway} away)
        </p>
        <p className="text-success">Drop-off: {rideRequest.dropoffLocation}</p>
        <p className="text-success">
          Estimated Fare: ${rideRequest.estimatedFare.toFixed(2)}
        </p>
        <p className="text-success">
          Estimated Time: {rideRequest.estimatedTime}
        </p>
      </div>
      <div className="d-flex justify-content-end gap-2">
        <button
          className="btn btn-danger px-4 py-2 rounded-2 fw-semibold"
          onClick={onDecline}
        >
          Decline
        </button>
        <button
          className="btn text-white px-4 py-2 rounded-2 fw-semibold"
          style={{ backgroundColor: "#0f6e55" }}
          onClick={() => onAccept(rideRequest)}
        >
          Accept Ride
        </button>
      </div>
    </div>
  );
};

export default D_NewRideRequestContent;
