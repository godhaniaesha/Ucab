import React from "react";

const D_ActiveRideContent = ({ currentTrip, onStartTrip, onCompleteTrip }) => {
  // ...existing code...
  if (!currentTrip) {
    return (
      <div className="d_tab_page p-lg-4 p-2 bg-white rounded-3 shadow-sm border border-light text-center">
        <h2 className="fs-3 fw-bold text-dark mb-lg-4 mb-md-2 mb-1">No Active Trip</h2>
        <p className="text-secondary leading-normal">
          You don't have an active trip right now. Accept a new request to get
          started!
        </p>
      </div>
    );
  }

  const isEnRoutePickup = currentTrip.status === "en_route_pickup";
  const isEnRouteDropoff = currentTrip.status === "en_route_dropoff";

  return (
    <div className="d_tab_page p-lg-4 p-2 bg-white rounded-3 shadow-sm border border-light">
      <h2 className="fs-3 fw-bold text-dark mb-lg-4 mb-md-2 mb-1">Active Ride</h2>
      <p className="text-secondary leading-normal mb-lg-4 mb-md-2 mb-1">
        {isEnRoutePickup &&
          "You are en route to the passenger's pickup location."}
        {isEnRouteDropoff &&
          "You are currently on an active trip. Follow the navigation to the passenger's destination."}
      </p>
      <div className="bg-primary-subtle p-3 rounded-2 border border-primary-subtle mb-lg-4 mb-md-2 mb-1">
        <p className="fw-semibold text-primary-emphasis">
          Passenger: {currentTrip.passengerName}
        </p>
        <p className="text-secondary">
          Status: {isEnRoutePickup ? "En route to Pickup" : "En route to Drop-off"}
        </p>
        <p className="text-secondary">Pickup: {currentTrip.pickupLocation}</p>
        <p className="text-secondary">
          Drop-off: {currentTrip.dropoffLocation}
        </p>
        <p className="text-secondary">ETA: {currentTrip.eta} minutes</p>
        <p className="text-secondary">
          Distance Remaining: {currentTrip.distanceRemaining} km
        </p>
      </div>
      <div className="d-flex justify-content-end gap-2">
        {isEnRoutePickup && (
          <button
            className="btn text-white px-4 py-2 rounded-2 fw-semibold"
            style={{ backgroundColor: "#0f6e55" }}
            onClick={onStartTrip}
          >
            Start Trip (Reached Pickup)
          </button>
        )}
        {isEnRouteDropoff && (
          <button
            className="btn text-white px-4 py-2 rounded-2 fw-semibold"
            style={{ backgroundColor: "#0f6e55" }}
            onClick={onCompleteTrip}
          >
            Complete Trip
          </button>
        )}
      </div>
    </div>
  );
};

export default D_ActiveRideContent;
