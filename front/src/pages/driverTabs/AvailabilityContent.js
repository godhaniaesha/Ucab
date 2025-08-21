import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { setAvailability, updateLocation } from "../../redux/slice/driver.slice";

const D_AvailabilityContent = ({ setHasNewRequest, isTripActive }) => {
  const [isOnline, setIsOnline] = useState(false);
  const dispatch = useDispatch();
  const locationIntervalRef = useRef(null);

  // Helper to get current coordinates
  const getCurrentCoordinates = () =>
    new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const { latitude, longitude } = pos.coords;
            resolve([longitude, latitude]);
          },
          (err) => reject(err)
        );
      } else {
        reject(new Error("Geolocation not supported"));
      }
    });
    console.log(getCurrentCoordinates,"cordinates");
    

  // Handle switch toggle
  const handleToggle = async (e) => {
    const online = e.target.checked;
    setIsOnline(online);

    // Update availability status
    dispatch(setAvailability({ available: online }));

    if (online) {
      // Start sending location every 5 seconds
      locationIntervalRef.current = setInterval(async () => {
        try {
          const coordinates = await getCurrentCoordinates();
          dispatch(updateLocation({ coordinates }));
        } catch (err) {
          // Optionally handle geolocation error
        }
      }, 5000);
    } else {
      // Stop sending location
      clearInterval(locationIntervalRef.current);
      locationIntervalRef.current = null;
    }

    if (!online) {
      setHasNewRequest(null);
    }
  };

  // Stop location updates if trip is active or component unmounts
  useEffect(() => {
    if (isTripActive && locationIntervalRef.current) {
      clearInterval(locationIntervalRef.current);
      locationIntervalRef.current = null;
    }
    return () => {
      if (locationIntervalRef.current) {
        clearInterval(locationIntervalRef.current);
      }
    };
  }, [isTripActive]);

  return (
    <div className="d_tab_page p-lg-4 p-2 bg-white rounded-3 shadow-sm border border-light">
      <h2 className="fs-3 fw-bold text-dark mb-lg-4 mb-md-2 mb-1">
        Availability Control
      </h2>
      <p className="text-secondary mb-lg-4 mb-md-2 mb-1">
        Toggle your online status to start receiving ride requests. Your current
        location will help us connect you with passengers nearby.
      </p>

      {/* Availability Card */}
      <div
        className={`p-lg-4 p-2 rounded-4 border shadow-sm d-flex align-items-center justify-content-between ${
          isOnline ? "bg-success-subtle" : "bg-danger-subtle"
        }`}
      >
        <div className="d-flex align-items-center">
          <i
            className={`bi ${isOnline ? "bi-wifi" : "bi-wifi-off"} fs-1 me-3 ${
              isOnline ? "text-success" : "text-danger"
            }`}
          ></i>
          <div>
            <h5
              className={`fw-bold mb-1 ${
                isOnline ? "text-success-emphasis" : "text-danger-emphasis"
              }`}
            >
              {isOnline ? "You are Online" : "You are Offline"}
            </h5>
            <p className="text-secondary small mb-0">
              {isOnline
                ? "You're ready to receive ride requests."
                : "Go online to start getting trips."}
            </p>
          </div>
        </div>

        {/* Toggle Switch */}
        <div className="form-check form-switch ms-3">
          <input
            className="form-check-input"
            type="checkbox"
            id="toggle-availability"
            checked={isOnline}
            onChange={handleToggle}
            disabled={isTripActive}
            style={{
              backgroundColor: isOnline ? "#0f6e55" : "",
              borderColor: "#0f6e55",
            }}
          />
          <label
            className="form-check-label fw-semibold text-secondary"
            htmlFor="toggle-availability"
          >
            {isOnline ? "Online" : "Offline"}
          </label>
        </div>
      </div>

      {/* Trip Restriction Message */}
      {isTripActive && (
        <p className="text-danger mt-3 fst-italic">
          🚫 You must complete your current trip before changing availability.
        </p>
      )}

      {/* Current Location Card */}
      <div className="p-lg-4 p-2 mt-4 rounded-4 border shadow-sm bg-light d-flex align-items-center">
        <i className="bi bi-geo-alt fs-2 text-primary me-3"></i>
        <div>
          <h6 className="fw-bold text-dark mb-1">Current Location</h6>
          <p className="mb-0 text-secondary small fst-italic">
            Fetching... (e.g., 123 Elm Street, Springfield)
          </p>
        </div>
      </div>
    </div>
  );
};

export default D_AvailabilityContent;
