import React, { useState } from "react";
import Pages from "./Pages";
// Import super admin tab components
import SA_DashboardContent from "./superAdminTabs/DashboardContent";
import SA_ManageDriversContent from "./superAdminTabs/ManageDriversContent";
import SA_ManagePassengersContent from "./superAdminTabs/ManagePassengersContent";
import SA_ManageVehiclesContent from "./superAdminTabs/ManageVehiclesContent";
import SA_TransactionsContent from "./superAdminTabs/TransactionsContent";
import ContactContent from "./superAdminTabs/ContactContent"; // ✅ Import new Contact page
import '../style/tab.css';

export default function SuperAdminTab() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const tabs = [
    {
      id: "dashboard",
      name: "Dashboard",
      iconClass: "bi bi-house-door-fill",
      component: <SA_DashboardContent />,
    },
    {
      id: "manage-drivers",
      name: "Manage Drivers",
      iconClass: "bi bi-person-badge-fill",
      component: <SA_ManageDriversContent />,
    },
    {
      id: "manage-passengers",
      name: "Manage Passengers",
      iconClass: "bi bi-people-fill",
      component: <SA_ManagePassengersContent />,
    },
    {
      id: "manage-vehicles",
      name: "Manage Vehicles",
      iconClass: "bi bi-car-front-fill",
      component: <SA_ManageVehiclesContent />,
    },
    {
      id: "transactions",
      name: "Transactions",
      iconClass: "bi bi-cash-stack",
      component: <SA_TransactionsContent />,
    },
    {
      id: "contacts",
      name: "Manage Contacts",
      iconClass: "bi bi-envelope-fill", // ✅ Contact icon
      component: <ContactContent />, // ✅ Contact Table Component
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
      <div
        className="d_app_container container-fluid d_sup d-flex align-items-center justify-content-center p-2 p-sm-4 p-lg-5"
        style={{ backgroundColor: "#e0f2f1" }}
      >
        <div
          className="d_main_content_wrapper w-100 bg-white rounded-3 shadow-lg d-flex flex-column flex-lg-row overflow-hidden"
          style={{ maxWidth: "1200px", minHeight: "500px" }}
        >
          {/* Sidebar */}
          <div
            className="d_nav_sidebar p-3 p-lg-4 d-flex flex-column rounded-top-lg-4 p-2 rounded-lg-start rounded-lg-top-0 shadow-sm"
            style={{ backgroundColor: "#fff" }}
          >
            <h1
              className="fs-3 fw-bold mb-lg-4 mb-md-2 mb-1 text-center text-lg-start d-none d-lg-block"
              style={{ color: "#0f6e55" }}
            >
              Admin Hub
            </h1>
            {/* Desktop Navigation */}
            <div className="d-none d-lg-flex flex-column gap-3">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  className={`d_nav_tab btn text-start py-3 px-4 rounded-3 text-nowrap d-flex align-items-center ${
                    activeTab === tab.id
                      ? "active bg-white text-success shadow"
                      : "text-light"
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <i className={`${tab.iconClass} fs-5 me-3`}></i>
                  <span className="fw-semibold fs-6">{tab.name}</span>
                </button>
              ))}
            </div>
            {/* Mobile Navigation */}
            <div className="d-lg-none" style={{ width: "100%", overflowX: "auto" }}>
              <h2
                className="fs-4 fw-bold mb-md-3 mb-0 text-center"
                style={{ color: "#0f6e55" }}
              >
                Admin Hub
              </h2>
              <div className="d_nav_tabs_container d-flex gap-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    className={`d_nav_tab btn py-2 px-3 rounded-3 d-flex flex-column align-items-center justify-content-center ${
                      activeTab === tab.id
                        ? "active bg-white text-success shadow"
                        : "text-light"
                    }`}
                    onClick={() => setActiveTab(tab.id)}
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

          {/* Content Area */}
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
