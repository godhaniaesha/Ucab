import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getHistory } from "../../redux/slice/driver.slice";
import { jwtDecode } from "jwt-decode";

const D_TripHistoryContent = () => {
  const dispatch = useDispatch();
  const { history, loading, error } = useSelector((state) => state.driver);

  const token = localStorage.getItem("token");
  let driverId = null;

  if (token) {
    try {
      const decoded = jwtDecode(token);
      driverId = decoded.id || decoded._id; 
    } catch (error) {
      console.error("Invalid token", error);
    }
  }

  useEffect(() => {
    dispatch(getHistory());
  }, [dispatch]);

  return (
    <div className="d_tab_page w-100 h-100 p-lg-4 p-2 bg-white rounded-3 shadow-sm border border-light d-flex flex-column h-100">
      <h2 className="fs-3 fw-bold text-dark mb-lg-4 mb-md-2 mb-1">Trip History</h2>
      <p className="text-secondary leading-normal mb-lg-3 mb-1">
        Review details of all your past completed rides.
      </p>
      {/* Loader & Error Handling */}
      {loading && <p className="text-primary">Loading trip history...</p>}
      {error && <p className="text-danger">⚠ {error}</p>}

      <div className="overflow-auto pe-2" style={{ maxHeight: "24rem" }}>
        <div className="d-flex flex-column gap-3">
          {history && history.length > 0 ? (
            history.map((trip, idx) => {
              const isMyTrip = trip.assignedDriver === driverId;
              return (
                <div 
                  key={trip._id || idx} 
                  className="bg-light p-3 rounded-2 border border-light position-relative"
                >
                  {!isMyTrip && (
                    <span 
                      className="badge bg-success position-absolute top-0 end-0 mt-2 me-2"
                    >
                      MY TRIP
                    </span>
                  )}
                   {isMyTrip && (
                    <span 
                      className="badge bg-success position-absolute top-0 end-0 mt-2 me-2"
                    >
                      PSNGR TRIP
                    </span>
                  )}
                  <p className="fw-semibold text-dark">Ride ID: #{trip._id}</p>
                  <p className="text-secondary">
                    Date: {new Date(trip.createdAt).toLocaleDateString()} | Time:{" "}
                    {new Date(trip.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} | Fare: ${trip.fare.toFixed(2)}
                  </p>
                  <p className="text-secondary">
                    Pickup: {trip.pickup?.address} → Drop: {trip.drop?.address}
                  </p>
                  <p className="text-secondary">
                    Vehicle: {trip.vehicleType} ({trip.preferredVehicleModel}) | Status:{" "}
                    <span className={`fw-bold ${trip.status === "cancelled" ? "text-danger" : "text-success"}`}>
                      {trip.status}
                    </span>
                  </p>
                </div>
              );
            })
          ) : (
            !loading && <p className="text-muted">No trip history available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default D_TripHistoryContent;