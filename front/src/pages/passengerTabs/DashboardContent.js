import React from "react";

export default function P_DashboardContent({ rideStats }) {
  // Example stats, replace with real data as needed
  const stats = rideStats || {
    ridesToday: 3,
    totalSpent: 72.5,
    upcomingRide: "Airport Pickup",
  };
  return (
    <div className="d_tab_page p-lg-4 p-2 bg-white rounded-3 shadow-sm border border-light">
      <h2 className="fs-3 fw-bold text-dark mb-lg-4 mb-md-2 mb-1">Passenger Dashboard</h2>
      <p className="text-secondary leading-normal mb-lg-4 mb-md-2 mb-1">
        Welcome to your passenger hub! Here's a quick overview of your ride activity and account summary.
      </p>
      <div className="row g-4 justify-content-center">
        <div className="col-12 mt-4">
          <div className="row g-4">
            <div className="col-12 col-md-4">
              <div className="bg-light p-lg-4 p-2 rounded-4 shadow-sm border border-light text-center h-100 d-flex flex-column justify-content-center">
                <i className="bi bi-geo-alt-fill fs-3 text-secondary mb-2"></i>
                <p className="text-muted mb-0">Rides Today</p>
                <h4 className="fs-4 fw-bold text-dark mt-1">{stats.ridesToday}</h4>
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="bg-light p-lg-4 p-2 rounded-4 shadow-sm border border-light text-center h-100 d-flex flex-column justify-content-center">
                <i className="bi bi-cash-stack fs-3 text-success mb-2"></i>
                <p className="text-muted mb-0">Total Spent</p>
                <h4 className="fs-4 fw-bold text-success mt-1">${stats.totalSpent.toFixed(2)}</h4>
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="bg-light p-lg-4 p-2 rounded-4 shadow-sm border border-light text-center h-100 d-flex flex-column justify-content-center">
                <i className="bi bi-calendar-event fs-3 text-primary mb-2"></i>
                <p className="text-muted mb-0">Upcoming Ride</p>
                <h4 className="fs-4 fw-bold text-primary mt-1">{stats.upcomingRide}</h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
