import React, { useState, useEffect } from "react";
import Pages from "./Pages";
import D_DashboardContent from "./driverTabs/DashboardContent";
import D_NewRideRequestContent from "./driverTabs/NewRideRequestContent";
import D_ActiveRideContent from "./driverTabs/ActiveRideContent";
import D_AvailabilityContent from "./driverTabs/AvailabilityContent";
import D_TripHistoryContent from "./driverTabs/TripHistoryContent";
import D_MyVehiclesContent from "./driverTabs/MyVehiclesContent";
import D_MyAccountContent from "./driverTabs/MyAccountContent";
import '../style/tab.css'; // Assuming you have a CSS file for styles

// --- Main Tab Component ---
export default function Tab() {
  // State to manage which tab is currently active
  const [activeTab, setActiveTab] = useState("dashboard"); // Default to 'dashboard'

  // State for managing ride requests and active trips
  const [rideRequest, setRideRequest] = useState(null);
  const [currentTrip, setCurrentTrip] = useState(null);
  const [isTripActive, setIsTripActive] = useState(false); // True if accepted, false otherwise

  // Mock User Data matching your Mongoose Schema
  const [userData, setUserData] = useState({
    name: "John Driver",
    email: "john.driver@example.com",
    password: "hashedpassword", // In a real app, this wouldn't be sent to frontend
    role: "DRIVER", // Assuming this user is a driver
    phone: "+15551234567",
    status: "OFFLINE", // Initial status, will be handled by Availability toggle
    location: {
      type: "Point",
      coordinates: [-74.006, 40.7128], // Example: New York City
    },
    vehicle: "60c72b2f9f1b2c001c8e4d5f", // Example Vehicle ID
    documentsVerified: true,
    profileImage: "https://placehold.co/120x120/0f6e55/ffffff?text=JD", // Placeholder image URL
    bankDetails: {
      accountHolderName: "John Driver",
      accountNumber: "1234567890", // Last 4 shown in UI
      ifscCode: "BARB0ABCDFG",
      bankName: "MyBank Inc.",
      branchName: "Central Branch",
    },
    paymentMethods: [
      {
        provider: "stripe",
        customerId: "cus_xyz123",
        paymentMethodId: "pm_abc456",
        methodType: "card",
        last4: "4242",
      },
      {
        provider: "razorpay",
        customerId: "cust_uvw789",
        paymentMethodId: "pm_def789",
        methodType: "bank",
        last4: "0000", // Placeholder for bank accounts without last4
      },
    ],
    otp: null,
    otpExpires: null,
  });

  // Simulate a new ride request appearing after a delay if no active trip or pending request
  useEffect(() => {
    let requestTimeout;
    if (!rideRequest && !isTripActive) {
      requestTimeout = setTimeout(() => {
        setRideRequest({
          passengerName: "Alice Wonderland",
          pickupLocation: "789 Pine Ave",
          dropoffLocation: "City Zoo",
          estimatedFare: 30.0,
          estimatedTime: "25 min",
          distanceAway: "4.5 km",
        });
      }, 7000); // Simulate a request coming in after 7 seconds
    }
    return () => clearTimeout(requestTimeout);
  }, [rideRequest, isTripActive]);

  const handleAcceptRide = (request) => {
    setCurrentTrip({ ...request, status: "en_route_pickup" }); // Set initial status
    setRideRequest(null); // Clear pending request
    setIsTripActive(true); // Mark trip as active
    setActiveTab("active-ride"); // Automatically switch to Active Ride tab
    setUserData((prevData) => ({ ...prevData, status: "ON_TRIP" })); // Update user status
  };

  const handleDeclineRide = () => {
    setRideRequest(null); // Clear pending request
    // Optionally, could show a message or log decline
  };

  const handleStartTrip = () => {
    if (currentTrip) {
      setCurrentTrip((prevTrip) => ({
        ...prevTrip,
        status: "en_route_dropoff",
      })); // Update status
      setUserData((prevData) => ({ ...prevData, status: "ON_TRIP" })); // Ensure status is ON_TRIP
      // In a real app, this would trigger navigation to drop-off
    }
  };

  const handleCompleteTrip = () => {
    if (currentTrip) {
      console.log("Trip Completed:", currentTrip);
      // In a real app, send trip data to backend, update earnings, etc.
      // For now, clear all trip related states
      setRideRequest(null);
      setCurrentTrip(null);
      setIsTripActive(false);
      setActiveTab("dashboard"); // Go back to dashboard after completing
      setUserData((prevData) => ({ ...prevData, status: "ONLINE" })); // Set status back to ONLINE after trip
    }
  };

  // Array of tab configurations with driver-specific content and Bootstrap Icons
  const tabs = [
    {
      id: "dashboard",
      name: "Dashboard",
      iconClass: "bi bi-house-door-fill",
      component: (
        <D_DashboardContent
          hasNewRequest={!!rideRequest}
          currentTrip={currentTrip}
          isTripActive={isTripActive}
        />
      ),
    },
    {
      id: "new-ride-request",
      name: "New Request",
      iconClass: "bi bi-bell-fill",
      component: (
        <D_NewRideRequestContent
          rideRequest={rideRequest}
          onAccept={handleAcceptRide}
          onDecline={handleDeclineRide}
        />
      ),
    },
    {
      id: "active-ride",
      name: "Active Ride",
      iconClass: "bi bi-geo-alt-fill",
      component: (
        <D_ActiveRideContent
          currentTrip={currentTrip}
          onStartTrip={handleStartTrip}
          onCompleteTrip={handleCompleteTrip}
        />
      ),
    },
    {
      id: "availability",
      name: "Availability",
      iconClass: "bi bi-toggle-on",
      component: (
        <D_AvailabilityContent
          setHasNewRequest={setRideRequest}
          isTripActive={isTripActive}
        />
      ),
    },
    {
      id: "trip-history",
      name: "Trip History",
      iconClass: "bi bi-journal-text",
      component: <D_TripHistoryContent />,
    },
    {
      id: "my-vehicles",
      name: "My Vehicles",
      iconClass: "bi bi-car-front-fill",
      component: <D_MyVehiclesContent />,
    },
    {
      id: "my-account",
      name: "My Account",
      iconClass: "bi bi-person-fill",
      component: (
        <D_MyAccountContent userData={userData} onSave={setUserData} />
      ),
    },
  ];

  return (
    <>
      {/* Bootstrap 5 CSS CDN */}
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
        rel="stylesheet"
        integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH"
        crossOrigin="anonymous"
      />
      {/* Bootstrap Icons CDN */}
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css"
      />

      {/* Main App Container */}
      <div
        className="d_app_container d_driver_tab container-fluid  d-flex align-items-center justify-content-center p-2 p-sm-4 p-lg-5"
        style={{ backgroundColor: "#e0f2f1" }}
      >
        <div
          className="d_main_content_wrapper w-100 bg-white rounded-3  shadow-lg d-flex flex-column flex-lg-row overflow-hidden"
          style={{ maxWidth: "1200px", minHeight: "600px" }}
        >
          {/* Left Navigation Sidebar */}
          <div
            className="d_nav_sidebar p-3 p-lg-4 d-flex flex-column rounded-top-lg-4 p-2 rounded-lg-start rounded-lg-top-0 shadow-sm"
            style={{ backgroundColor: "#fff" }}
          >
            <h1
              className="fs-3 fw-bold mb-lg-4 mb-md-2 mb-1 text-center text-lg-start d-none d-lg-block"
              style={{ color: "#0f6e55" }}
            >
              Driver Hub
            </h1>

            {/* Desktop Vertical Navigation */}
            <div className="d-none d-lg-flex flex-column gap-3">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  className={`d_nav_tab btn text-start py-3 px-4 rounded-3 text-nowrap d-flex align-items-center
                    ${
                      activeTab === tab.id
                        ? "active bg-white text-success shadow"
                        : "text-light"
                    }
                    ${
                      isTripActive &&
                      (tab.id === "new-ride-request" ||
                        tab.id === "availability")
                        ? "opacity-50 disabled"
                        : ""
                    }
                    `}
                  onClick={() => {
                    if (
                      isTripActive &&
                      (tab.id === "new-ride-request" ||
                        tab.id === "availability")
                    ) {
                      return;
                    }
                    setActiveTab(tab.id);
                  }}
                  disabled={
                    isTripActive &&
                    (tab.id === "new-ride-request" || tab.id === "availability")
                  }
                >
                  <i className={`${tab.iconClass} fs-5 me-3`}></i>
                  <span className="fw-semibold fs-6">{tab.name}</span>
                </button>
              ))}
            </div>

            {/* Mobile Horizontal Navigation */}
            <div className="d-lg-none" style={{width:"100%",overflowX:"auto"}} >
              <h2 className="fs-4 fw-bold mb-md-3 mb-0 text-center"
               style={{ color: "#0f6e55" }}
              >
                Driver Hub
              </h2>
              <div className="d_nav_tabs_container">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    className={`d_nav_tab btn py-2 px-3 rounded-3 d-flex flex-column align-items-center justify-content-center
                      ${
                        activeTab === tab.id
                          ? "active bg-white text-success shadow"
                          : "text-light"
                      }
                      ${
                        isTripActive &&
                        (tab.id === "new-ride-request" ||
                          tab.id === "availability")
                          ? "opacity-50 disabled"
                          : ""
                      }
                      `}
                    onClick={() => {
                      if (
                        isTripActive &&
                        (tab.id === "new-ride-request" ||
                          tab.id === "availability")
                      ) {
                        return;
                      }
                      setActiveTab(tab.id);
                    }}
                    disabled={
                      isTripActive &&
                      (tab.id === "new-ride-request" ||
                        tab.id === "availability")
                    }
                    style={{ minWidth: "70px", height: "60px" }}
                  >
                    <i className={`${tab.iconClass} mb-1`}></i>
                    <span
                      className="tab-text fw-semibold"
                      style={{ fontSize: "0.7rem" }}
                    >
                      {tab.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Tab Content Area */}
          <div className="d_content_area flex-grow-1 p-2 p-md-3 p-lg-4 bg-light rounded-bottom-4 rounded-lg-end rounded-lg-bottom-0 d-flex  align-items-start justify-content-lg-center justify-content-start  w-100 overflow-auto">
            {tabs.find((tab) => tab.id === activeTab)?.component}
          </div>
        </div>
      </div>
      {/* Bootstrap 5 JS Bundle */}
      <script
        src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eOzrKbVjKjJ"
        crossOrigin="anonymous"
      ></script>
    </>
  );
}
