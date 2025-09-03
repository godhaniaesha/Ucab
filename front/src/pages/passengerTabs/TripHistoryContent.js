import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { getTripHistory } from "../../redux/slice/passengers.slice";

const P_TripHistoryContent = () => {
  const dispatch = useDispatch();
  // Add null check for state.passengers
  const { tripHistory = [], loading = false } = useSelector((state) => state?.passenger || {}); 

  useEffect(() => {
    dispatch(getTripHistory());
  }, [dispatch]);

  return (
    <div className="p_tab_page w-100  p-lg-4 p-2 bg-white rounded-3 shadow-sm border border-light d-flex flex-column h-100">
      <h2 className="fs-3 fw-bold text-dark mb-lg-4 mb-md-2 mb-1">Trip History</h2>
      <p className="text-secondary leading-normal mb-lg-3 mb-1">
       Review details of all your past completed rides.
      </p>

      <div className="overflow-auto pe-2" style={{ maxHeight: "24rem" }}>
        {loading ? (
          <p className="text-secondary">Loading...</p>
        ) : tripHistory && tripHistory.length > 0 ? (
          <div className="d-flex flex-column gap-3">
            {tripHistory.map((ride) => (
              <div
                key={ride._id}
                className="bg-light p-3 rounded-2 border border-light"
              >
                <p className="fw-semibold text-dark">Ride ID: #{ride._id}</p>
                <p className="text-secondary">
                  Date: {moment(ride.createdAt).format("YYYY-MM-DD")} | Time:{" "}
                  {moment(ride.createdAt).format("h:mm A")} | Fare: $
                  {ride.fare?.toFixed(2)}
                </p>
                <p className="text-secondary">
                  Driver ID: {ride.assignedDriver || "N/A"} | Vehicle:{" "}
                  {ride.preferredVehicleModel || ride.vehicleType} | Status:{" "}
                  {ride.status}
                </p>
                <p className="text-secondary">
                  Pickup: {ride.pickup?.address} | Dropoff: {ride.drop?.address}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-secondary">No trips found.</p>
        )}
      </div>
    </div>
  );
};

export default P_TripHistoryContent;
