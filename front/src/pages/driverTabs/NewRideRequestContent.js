import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  acceptBooking,
  cancelBooking as driverCancelBooking,
  checkNewRequests,
  getHistory,
  startTrip,
} from "../../redux/slice/driver.slice";
import {
  cancelBooking as passengerCancelBooking, // 👈 passenger slice cancel
} from "../../redux/slice/passengers.slice";
import ride from "../../image/ride.png";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";

const D_NewRideRequestContent = () => {
  const dispatch = useDispatch();
  const { newRequests, history, loading, error, success } = useSelector(
    (state) => state.driver
  );
  const { driverInfo } = useSelector((state) => state.auth);
  const token = localStorage.getItem("token");
  let driverId = null;

  if (token) {
    try {
      const decoded = jwtDecode(token);
      console.log(decoded, "decodedToken");
      driverId = decoded.id || decoded._id; // 👈 depends on your backend payload
    } catch (error) {
      console.error("Invalid token", error);
    }
  }

  const acceptedRequests = history.filter((r) => r.status == "accepted");
  const assignedRequests = history.filter((r) => r.status == "assigned");
  const pendingRequests = newRequests;

  useEffect(() => {
    dispatch(checkNewRequests());
    dispatch(getHistory());
  }, [dispatch]);

  useEffect(() => {
    if (success) {
      dispatch(checkNewRequests());
      dispatch(driverCancelBooking()); // 👈 driver cancel clear after success
      dispatch(getHistory());
    }
  }, [success, dispatch]);

  const handleStartTrip = (id) => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coordinates = [
          position.coords.longitude,
          position.coords.latitude,
        ];

        dispatch(startTrip({ id, coordinates }))
          .unwrap()
          .then(() => {
            toast.success("Trip started successfully 🚖");
            localStorage.setItem("driverActiveTab", "active-ride");
          })
          .catch((err) => {
            localStorage.setItem("driverActiveTab", "trip-history");
            toast.error(err || "Failed to start trip");
          });
      },
      () => {
        localStorage.setItem("driverActiveTab", "trip-history");
        toast.error("Unable to fetch location");
      }
    );
  };

  const requests = [
    ...pendingRequests,
    ...acceptedRequests.filter(
      (r) => !pendingRequests.some((p) => p._id === r._id)
    ),
  ];

  const allRequests = [
    ...pendingRequests,
    ...history.filter((r) => !pendingRequests.some((p) => p._id === r._id)),
  ];

  if (loading) {
    return (
      <div className="d_tab_page w-100 h-100 p-lg-4 p-2 bg-white rounded-3 shadow-sm border border-light text-center">
        <p className="text-primary">Checking for new ride requests...</p>
      </div>
    );
  }

  if (allRequests.length === 0) {
    return (
      <div className="d_tab_page w-100 h-100 p-lg-4 p-2  bg-white rounded-3 shadow-sm border border-light text-center d-flex flex-column align-items-center justify-content-center">
        <img
          src={ride}
          style={{ width: "200px", marginBottom: "10px" }}
          alt="No rides"
        />
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

      {allRequests.map((rideRequest) => {
        console.log(rideRequest, "rideRequest");

        const isAssignedToMe = rideRequest.assignedDriver === driverId;
        console.log(rideRequest.assignedDriver === driverId, "dfgd");

        return (
          <div
            key={rideRequest._id}
            className="bg-success-subtle p-3 rounded-2 border border-success-subtle mb-3"
          >
            <p className="fw-semibold text-success-emphasis">
              Ride ID: {rideRequest._id}
            </p>
            <p className="text-success">Pickup: {rideRequest.pickup?.address}</p>
            <p className="text-success">
              Drop-off: {rideRequest.drop?.address}
            </p>
            <p className="text-success">
              Vehicle: {rideRequest.vehicleType} ({rideRequest.preferredVehicleModel})
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
                className={`fw-bold ${rideRequest.status === "cancelled"
                    ? "text-danger"
                    : "text-success"
                  }`}
              >
                {rideRequest.status}
              </span>
            </p>

            <div className="d-flex justify-content-end gap-2 mt-3">
              {isAssignedToMe ? (
                <>
                  {rideRequest.status === "accepted" ? (
                    <button
                      className="btn text-white px-4 py-2 rounded-2 fw-semibold"
                      style={{ backgroundColor: "#0f6e55" }}
                      onClick={() => handleStartTrip(rideRequest._id)}
                    >
                      Start Ride
                    </button>
                  ) : rideRequest.status === "assigned" ? (
                    <>
                      <button
                        className="btn btn-danger px-4 py-2 rounded-2 fw-semibold"
                        onClick={async () => {
                          try {
                            await dispatch(
                              driverCancelBooking(rideRequest._id)
                            ).unwrap();
                            localStorage.setItem(
                              "driverActiveTab",
                              "trip-history"
                            );
                            toast.success("Ride declined successfully");
                          } catch (err) {
                            toast.error("Failed to decline ride");
                          }
                        }}
                      >
                        Decline
                      </button>
                      <button
                        className="btn text-white px-4 py-2 rounded-2 fw-semibold"
                        style={{ backgroundColor: "#0f6e55" }}
                        onClick={async () => {
                          try {
                            await dispatch(
                              acceptBooking(rideRequest._id)
                            ).unwrap();
                            toast.success("Ride accepted successfully");
                          } catch (err) {
                            toast.error("Failed to accept ride");
                          }
                        }}
                      >
                        Accept Ride
                      </button>
                    </>
                  ) : null}
                </>
              ) : rideRequest.status === "assigned" ? (
                console.log(rideRequest, "rideRequest-passenger"),
                <button
                  className="btn btn-danger px-4 py-2 rounded-2 fw-semibold"
                  onClick={() =>
                    dispatch(passengerCancelBooking(rideRequest._id))
                      .unwrap()
                      .then(() =>
                        localStorage.setItem("driverActiveTab", "trip-history")
                      )
                  }
                >
                  Cancel
                </button>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default D_NewRideRequestContent;