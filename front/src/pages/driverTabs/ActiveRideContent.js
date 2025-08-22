import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getActiveBooking, completeBooking } from "../../redux/slice/driver.slice";
import trip from "../../image/notrip.png";

const D_ActiveRideContent = ({ onStartTrip }) => {
  const dispatch = useDispatch();
  const { currentTrip, loading, error } = useSelector((state) => state.driver);

  console.log(currentTrip, "currentTrip");

  // 🔹 Fetch active booking when component mounts
  useEffect(() => {
    dispatch(getActiveBooking());
  }, [dispatch]);

  // 🔹 Handle Complete Trip
  const handleCompleteTrip = () => {
    if (currentTrip?._id) {
      dispatch(completeBooking(currentTrip._id));
    }
  };

  // 🔹 Loading state
  if (loading) {
    return (
      <div className="d_tab_page w-100 h-100 p-lg-4 p-2 bg-white rounded-3 shadow-sm border border-light text-center">
        <p className="text-primary">Fetching active booking...</p>
      </div>
    );
  }

  // 🔹 Error state
  if (error) {
    return (
      <div className="d_tab_page w-100 h-100 p-lg-4 p-2 bg-white rounded-3 shadow-sm border border-light text-center">
        <p className="text-danger">⚠ {error}</p>
      </div>
    );
  }

  // 🔹 No Active Trip
  if (!currentTrip) {
    return (
      <div className="d_tab_page w-100 h-100 p-lg-4 p-2 bg-white rounded-3 shadow-sm border border-light text-center d-flex flex-column align-items-center justify-content-center">
        <img src={trip} style={{width:"150px", marginBottom:"10px"}}></img>
        <h2 className="fs-3 fw-bold text-dark mb-lg-4 mb-md-2 mb-1">No Active Trip</h2>
        <p className="text-secondary leading-normal">
          You don't have an active trip right now. Accept a new request to get
          started!
        </p>
      </div>
    );
  }

  const isEnRoutePickup = currentTrip.status === "accepted";
  const isEnRouteDropoff = currentTrip.status === "on_trip";

  return (
    <div className="d_tab_page w-100 h-100 p-lg-4 p-2 bg-white rounded-3 shadow-sm border border-light">
      <h2 className="fs-3 fw-bold text-dark mb-lg-4 mb-md-2 mb-1">Active Ride</h2>
      <p className="text-secondary leading-normal mb-lg-4 mb-md-2 mb-1">
        {isEnRoutePickup &&
          "You are en route to the passenger's pickup location."}
        {isEnRouteDropoff &&
          "You are currently on an active trip. Follow the navigation to the passenger's destination."}
      </p>

      <div className="bg-primary-subtle p-3 rounded-2 border border-primary-subtle mb-lg-4 mb-md-2 mb-1">
        <p className="fw-semibold text-primary-emphasis">
          Passenger ID: {currentTrip.passenger}
        </p>
        <p className="text-secondary">
          Status:{" "}
          {isEnRoutePickup
            ? "En route to Pickup"
            : isEnRouteDropoff
            ? "En route to Drop-off"
            : currentTrip.status}
        </p>
        <p className="text-secondary">
          Pickup: {currentTrip.pickup?.address}
        </p>
        <p className="text-secondary">
          Drop-off: {currentTrip.drop?.address}
        </p>
        <p className="text-secondary">Fare: ₹{currentTrip.fare}</p>
        <p className="text-secondary">
          Distance: {currentTrip.distanceKm?.toFixed(2) || 0} km
        </p>
        <p className="text-secondary">
          Vehicle: {currentTrip.vehicleType} ({currentTrip.preferredVehicleModel})
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
            onClick={handleCompleteTrip}
          >
            Complete Trip
          </button>
        )}
      </div>
    </div>
  );
};

export default D_ActiveRideContent;
