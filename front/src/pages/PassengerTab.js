import React, { useState, useEffect } from "react";
import Pages from "./Pages";
// Import passenger tab components (implement these separately)
import P_DashboardContent from "./passengerTabs/DashboardContent";
import P_NewRideContent from "./passengerTabs/NewRideContent";
import P_ActiveRideContent from "./passengerTabs/ActiveRideContent";
import P_TripHistoryContent from "./passengerTabs/TripHistoryContent";
import P_PaymentMethodsContent from "./passengerTabs/PaymentMethodsContent";
import P_MyAccountContent from "./passengerTabs/MyAccountContent";
import '../style/tab.css';

export default function PassengerTab() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [rideRequest, setRideRequest] = useState(null);
  const [currentTrip, setCurrentTrip] = useState(null);
  const [isTripActive, setIsTripActive] = useState(false);
  const [userData, setUserData] = useState({
    name: "Alice Passenger",
    email: "alice.passenger@example.com",
    role: "PASSENGER",
    phone: "+15559876543",
    status: "IDLE",
    location: {
      type: "Point",
      coordinates: [-74.006, 40.7128],
    },
    profileImage: "https://placehold.co/120x120/0f6e55/ffffff?text=AP",
    paymentMethods: [],
    otp: null,
    otpExpires: null,
  });

  // Simulate ride request for passenger
  useEffect(() => {
    let requestTimeout;
    if (!rideRequest && !isTripActive) {
      requestTimeout = setTimeout(() => {
        setRideRequest({
          driverName: "John Driver",
          vehicle: "Toyota Prius",
          pickupLocation: "789 Pine Ave",
          dropoffLocation: "City Zoo",
          estimatedFare: 30.0,
          estimatedTime: "25 min",
        });
      }, 7000);
    }
    return () => clearTimeout(requestTimeout);
  }, [rideRequest, isTripActive]);

  const handleAcceptDriver = (request) => {
    setCurrentTrip({ ...request, status: "en_route_pickup" });
    setRideRequest(null);
    setIsTripActive(true);
    setActiveTab("active-ride");
    setUserData((prevData) => ({ ...prevData, status: "ON_TRIP" }));
  };

  const handleDeclineDriver = () => {
    setRideRequest(null);
  };

  const handleCompleteTrip = () => {
    setCurrentTrip(null);
    setIsTripActive(false);
    setActiveTab("dashboard");
    setUserData((prevData) => ({ ...prevData, status: "IDLE" }));
  };

  const tabs = [
    {
      id: "dashboard",
      name: "Dashboard",
      iconClass: "bi bi-house-door-fill",
      component: <P_DashboardContent />,
    },
    {
      id: "new-ride",
      name: "New Ride",
      iconClass: "bi bi-bell-fill",
      component: (
        <P_NewRideContent
          rideRequest={rideRequest}
          onAccept={handleAcceptDriver}
          onDecline={handleDeclineDriver}
        />
      ),
    },
    {
      id: "active-ride",
      name: "Payment",
      iconClass: "bi bi-geo-alt-fill",
      component: (
        <P_ActiveRideContent
          currentTrip={currentTrip}
          onCompleteTrip={handleCompleteTrip}
        />
      ),
    },
    {
      id: "trip-history",
      name: "Trip History",
      iconClass: "bi bi-journal-text",
      component: <P_TripHistoryContent />,
    },
    {
      id: "my-account",
      name: "My Account",
      iconClass: "bi bi-person-fill",
      component: <P_MyAccountContent userData={userData} onSave={setUserData} />,
    },
  ];

  return (
    <>
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
        rel="stylesheet"
        integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH"
        crossOrigin="anonymous"
      />
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css"
      />
      <div className="d_app_container container-fluid d_pass d-flex align-items-center justify-content-center p-2 p-sm-4 p-lg-5" style={{ backgroundColor: "#e0f2f1" }}>
        <div className="d_main_content_wrapper w-100 bg-white rounded-3 shadow-lg d-flex flex-column flex-lg-row overflow-hidden" style={{ maxWidth: "1200px", minHeight: "600px" }}>
          <div className="d_nav_sidebar p-3 p-lg-4 d-flex flex-column rounded-top-lg-4 p-2 rounded-lg-start rounded-lg-top-0 shadow-sm" style={{ backgroundColor: "#fff" }}>
            <h1 className="fs-3 fw-bold mb-lg-4 mb-md-2 mb-1 text-center text-lg-start d-none d-lg-block" style={{ color: "#0f6e55" }}>
              Passenger Hub
            </h1>
            <div className="d-none d-lg-flex flex-column gap-3">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  className={`d_nav_tab btn text-start py-3 px-4 rounded-3 text-nowrap d-flex align-items-center ${activeTab === tab.id ? "active bg-white text-success shadow" : "text-light"}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <i className={`${tab.iconClass} fs-5 me-3`}></i>
                  <span className="fw-semibold fs-6">{tab.name}</span>
                </button>
              ))}
            </div>
            <div className="d-lg-none" style={{width:"100%",overflowX:"auto"}}>
              <h2 className="fs-4 fw-bold mb-md-3 mb-0 text-center" style={{ color: "#0f6e55" }}>
                Passenger Hub
              </h2>
              <div className="d_nav_tabs_container">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    className={`d_nav_tab btn py-2 px-3 rounded-3 d-flex flex-column align-items-center justify-content-center ${activeTab === tab.id ? "active bg-white text-success shadow" : "text-light"}`}
                    onClick={() => setActiveTab(tab.id)}
                    style={{ minWidth: "70px", height: "60px" }}
                  >
                    <i className={`${tab.iconClass} mb-1`}></i>
                    <span className="tab-text fw-semibold" style={{ fontSize: "0.7rem" }}>
                      {tab.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="d_content_area flex-grow-1 p-2 p-md-3 p-lg-4 bg-light rounded-bottom-4 rounded-lg-end rounded-lg-bottom-0 d-flex align-items-center justify-content-center w-100 overflow-auto">
            {tabs.find((tab) => tab.id === activeTab)?.component}
          </div>
        </div>
      </div>
      <script
        src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eOzrKbVjKjJ"
        crossOrigin="anonymous"
      ></script>
    </>
  );
}
